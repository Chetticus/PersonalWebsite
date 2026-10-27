"""Import only approved narrative cells; private raw exports stay in research/.

Run after exporting the specified worksheet to research/structure.csv and the
workbook to research/structure.xlsx. This does not download or import photos.
"""
import csv
import json
import re
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
with (ROOT / 'research/structure.csv').open(encoding='utf-8-sig', newline='') as stream:
    rows = list(csv.reader(stream))

def cell(number, column=4, occurrence=0):
    matches = [row for row in rows if row and row[0] == str(number)]
    return matches[occurrence][column].replace('\\n', '\n').strip()

def paragraphs(text):
    text = text.replace('**', '')
    # The sheet embeds production notes and a certificate list inside the VEX copy.
    text = re.split(r'\[Insert các hình ảnh Certificate', text)[0]
    text = re.sub(r'\[Insert[^\]]*\]', '\n\n', text)
    return [part.strip() for part in re.split(r'\n\s*\n', text) if part.strip()]

with zipfile.ZipFile(ROOT / 'research/structure.xlsx') as workbook:
    rels = ET.fromstring(workbook.read('xl/worksheets/_rels/sheet6.xml.rels'))
    supplied_links = {item.attrib['Id']: item.attrib['Target'] for item in rels}

def link(number, label):
    return {'label': label, 'href': supplied_links[f'rId{number}']}

def media(topic, labels, kinds=None):
    kinds = kinds or {}
    return [{'id': f'{topic}-{i+1:02}', 'src': f'/mock/{kinds.get(i, topic)}.svg',
             'alt': f'Mock image: {label}. Replace with the actual photograph or document.',
             'caption': label, 'mock': True} for i, label in enumerate(labels)]

def repeated(label, count):
    return [f'{label} {i+1}' for i in range(count)]

def project(key, number, title, role, topic, labels, *, occurrence=0, links=None, note=None, groups=None, kinds=None):
    slots = media(topic, labels, kinds)
    for i, slot in enumerate(slots):
        slot['id'] = f'{key}-{i+1:02}'
    return key, {'id': key, 'title': title, 'status': role,
                 'paragraphs': paragraphs(cell(number, occurrence=occurrence)),
                 'media': slots, 'links': links or [],
                 **({'note': note} if note else {}), **({'groups': groups} if groups else {})}

projects = dict([
    project('vex', 4, 'VEX: road to the world stage', 'Main coder', 'robotics',
            repeated('Building and testing', 3) + repeated('Northern Qualification', 4)
            + repeated('National Championship', 3) + repeated('World Championship', 4)
            + ['World Championship qualifier certificate', 'Robot Skills Champion & Innovate Award',
               'Create Award — New Year’s Mayhem', 'Tournament Champion & Energy Award',
               'First Honor — VEX Asia Open', 'Talent Award — VEX Asia Open'],
            kinds={i: 'certificate' for i in range(14, 20)},
            groups=[{'after': 0, 'start': 0, 'count': 3}, {'after': 1, 'start': 3, 'count': 4},
                    {'after': 2, 'start': 7, 'count': 3}, {'after': 3, 'start': 10, 'count': 4},
                    {'after': 'end', 'start': 14, 'count': 6}]),
    project('meckup', 10, 'MECKUP Quest, Hong Kong', 'AI & robotics competition participant', 'robotics',
            repeated('MECKUP Quest competition', 4) + ['Participation certificate'], kinds={4:'certificate'}),
    project('aigc', 11, 'AI & Generative Content Competition', 'Singapore · 2026', 'research',
            ['Competition certificate', 'AI–IoT safety and greenhouse gas monitoring poster'], kinds={0:'certificate'},
            note='The project abstract link has not yet been supplied.'),
    project('kid-engineer', 13, 'Passing the tools forward', 'Robotics team mentor · Kid Engineer', 'classroom',
            repeated('Kid Engineer mentoring and WRO projects', 5)),
    project('taytranslator', 13, 'TayTranslator', 'Inventor · Vietnamese–Tày translation', 'translation',
            ['Tày → Vietnamese', 'Vietnamese → Tày', 'English → Tày', 'Tày → English'], occurrence=1,
            links=[link(12, 'Open TayTranslator')],
            note='The dataset sizes, chrF scores, and field-evaluation accuracy are reported in the supplied account; the 95% figure applies to that evaluation’s scope.'),
    project('codingbuddy', 14, 'The CodingBuddy', 'Researcher & lead tutor', 'classroom',
            ['Online learning platform', 'A coding lesson', 'Student projects'],
            note='The platform link is pending.'),
    project('humanitas', 15, 'Humanitas', 'Co-founder · Bản Liền, Lào Cai', 'community',
            repeated('Learning, digital skills, and community life in Bản Liền', 6),
            groups=[{'after':0,'start':0,'count':3},{'after':1,'start':3,'count':3}]),
    project('rural-research', 16, 'Engineering access to education', 'Co-author · Rural technology infrastructure', 'research',
            ['Research paper preview'], links=[link(15, 'Read the supplied paper')],
            note='Publication in the International Journal of Computer Applications is reported in the supplied account; publication metadata awaits confirmation. Infrastructure performance and costs are projections, not deployed outcomes.'),
    project('revinyl', 17, 'Revinyl Project', 'Founder', 'listening',
            ['A shared listening session', 'Vinyl Digital Library', 'Vinyl Healing Circle']),
    project('vinyl-heritage', 18, 'Vinyl Heritage Vietnam', 'Owner & inventor', 'listening',
            ['Vietnamese music archive', 'An interactive music timeline', 'Digital and Vinylized listening modes'],
            links=[link(18, 'Explore Vinyl Heritage Vietnam')]),
    project('vinylize', 19, 'Vinylize', 'Inventor', 'waveform',
            ['Interactive groove model', 'Original and simulated audio comparison'],
            note='The platform link and final demonstration images are pending.'),
    project('vinyl-research', 20, 'Listening, emotion, and privacy', 'Co-author · Edge AI research', 'research',
            ['Silent-Observer Framework manuscript preview'], links=[link(20, 'Read the supplied manuscript')],
            note='This account describes a literature review and proposed framework. Publication status and validated model results are not supplied.'),
    project('vbee', 21, 'SelectSpeak at VBEE AITALK', 'Software engineering intern', 'workspace',
            ['SelectSpeak article reader', 'Text-to-speech workflow', 'Extension testing'],
            links=[{'label':'Visit VBEE AITALK','href':supplied_links['rId21'].split('?')[0]}]),
    project('steams', 23, 'Making science approachable', 'Head of Expertise · STEAMS', 'classroom',
            repeated('STEAMS workshops, exhibitions, and learning', 5), links=[link(22, 'Visit STEAMS')]),
    project('newton', 24, 'Newton Robotics Club', 'Vice president & programming mentor', 'robotics',
            repeated('Newton Robotics Club projects and community', 5),
            note='The club’s page link will be added after confirmation.'),
    project('hku-ntu', 25, 'Business, innovation, and digitalisation', 'Participant · HKU Academy for the Talented & NTU Singapore', 'workspace',
            repeated('HKU / NTU programme and team project', 3) + ['NTU programme certificate', 'HKU programme certificate'],
            kinds={3:'certificate',4:'certificate'}),
    project('running', 30, 'Miles & milestones', 'Running, endurance, and everyday practice', 'running',
            ['Hanoi Marathon Heritage Race', 'Hanoi Marathon Heritage Race — on the course', 'Heritage Race finisher certificate',
             'Tây Hồ Half Marathon', 'Tây Hồ Half Marathon — on the course', 'Tây Hồ finisher certificate',
             'Ecopark City Trail', 'Ecopark City Trail finisher certificate', 'Empower Run', 'Empower Run — running for a cause'],
            kinds={2:'certificate',5:'certificate',7:'certificate'}),
])

# The English column contains Vietnamese for STEAMS. Faithful translation only.
projects['steams']['paragraphs'] = [
    'At Hanoi–Amsterdam High School for the Gifted, STEAMS gave me a place to share my interest in science and technology with friends who felt the same way. As Head of Expertise, I led more than 10 members in creating academic materials, developing STEM content, and designing activities that made scientific knowledge more approachable and engaging for students.',
    'With the club, I helped organize workshops, science exhibitions, and online learning series, giving hundreds of students space to explore ideas, exchange knowledge, and try creative projects. Alongside guiding academic work, I looked for STEM competitions and events that could help members develop their abilities. STEAMS showed me how a passion for science can spread when people are encouraged to ask questions, experiment, and discover things for themselves.'
]
projects['steams']['translated'] = True

personal = paragraphs(cell(1))[0]
personal = re.sub(r"^Hi, I'm Hai Nam\.\s*", '', personal)
about = paragraphs(cell(2))
identity = {'statement': personal, 'about': about,
            'media': media('family', ['Childhood memories', 'Family and early curiosity'])}
output = '// Narrative imported from Nam’s supplied website-content worksheet.\n// Metrics are owner-supplied claims; mock media are explicitly labeled.\n'
output += 'export const biography = ' + json.dumps(identity, ensure_ascii=False, indent=2) + ';\n\n'
output += 'export const projects = ' + json.dumps(projects, ensure_ascii=False, indent=2) + ';\n'
(ROOT / 'src/projects.js').write_text(output, encoding='utf-8')
print(f'Imported {len(projects)} stories and {sum(len(p["media"]) for p in projects.values())} project media slots; 2 biography slots.')
