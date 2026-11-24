// Project tutorials: original walkthroughs, fictional authors. In paragraphs, |text| marks inline code.
import { parse } from './courses/dsl';

export const AUTHORS = {
  maya: { name: 'Maya Torres', handle: 'maya', bio: 'I teach beginners to code with tiny, fun projects. Pixel art and Python are my happy place.', work: 'Teaching assistant at Pixel Academy', place: 'Lahore, PK', c: '#7c4dff' },
  ravi: { name: 'Ravi Singh', handle: 'ravi', bio: 'Data nerd and puzzle fan. I like turning messy numbers into clear answers.', work: 'Junior data analyst', place: 'Delhi, IN', c: '#00897b' },
  lena: { name: 'Lena Kovacs', handle: 'lena', bio: 'Game developer and hardware tinkerer. If it blinks or beeps, I want to build it.', work: 'Indie game developer', place: 'Budapest, HU', c: '#e11d74' },
  omar: { name: 'Omar Haddad', handle: 'omar', bio: 'Full-stack developer exploring what AI tools can (and cannot) do.', work: 'Software engineer', place: 'Amman, JO', c: '#2563eb' },
  aiko: { name: 'Aiko Tanaka', handle: 'aiko', bio: 'I help new developers get their first app running and online without the stress.', work: 'Developer advocate', place: 'Osaka, JP', c: '#f97316' },
};
const mk = (o) => ({ ...o, blocks: parse(o.body) });

export const TUTORIALS = [
  mk({ id: 'gif', title: 'Create a GIF with Python', lang: 'Python', chips: ['Python'], level: 'Beginner', mins: 20, date: 'Nov 2, 2026', ts: 20261102, au: 'maya', cover: 'gif', likes: 981, saves: 972, comments: 228, courses: ['python'],
    pre: 'Python and Command Line fundamentals', ver: 'Python 3.11, imageio 2.34', tags: ['Python', 'Beginner'],
    res: [['imageio documentation', 'https://imageio.readthedocs.io/'], ['Python documentation', 'https://docs.python.org/3/']], body: `
# Introduction
A GIF is a flipbook: a list of pictures shown one after another, with no sound. In this project you turn several images into one animated GIF with only a few lines of Python. You will use a list, a |for| loop and a library called |imageio|.
@loop
# Install the library
~~~
pip install imageio
~~~
# Load the frames
Put your pictures in one folder and name them |frame1.png|, |frame2.png| and so on. Then read them into a list.
~~~
import imageio.v2 as imageio

frames = []
for n in range(1, 4):
    frames.append(imageio.imread(f'frame{n}.png'))
~~~
# Save the GIF
~~~
imageio.mimsave('output.gif', frames, duration=0.5)
~~~
|duration| is how long each frame stays on screen (seconds in imageio v2). Open |output.gif| in a browser to watch it play.
> Every frame must have the same width and height, or saving will fail.` }),
  mk({ id: 'word', title: 'Build a Word Guessing Game', lang: 'Python', chips: ['Python'], level: 'Beginner', mins: 25, date: 'Oct 28, 2026', ts: 20261028, au: 'ravi', cover: 'word', likes: 640, saves: 512, comments: 97, courses: ['python'],
    pre: 'Python variables, loops and conditions', ver: 'Python 3.11', tags: ['Python', 'Beginner'],
    res: [['Python documentation: strings', 'https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str']], body: `
# Introduction
In this game the computer picks a secret word and you guess it one letter at a time. You will practise lists, strings, loops and conditions.
@loop
# Pick a word
~~~
import random
words = ['python', 'coding', 'planet', 'rocket']
secret = random.choice(words)
guessed = []
attempts = 8
~~~
# The game loop
Each round shows the word with underscores for letters you have not found yet, then asks for a guess.
~~~
while attempts > 0:
    shown = ' '.join(c if c in guessed else '_' for c in secret)
    print('Word:', shown, '| tries left:', attempts)
    if '_' not in shown:
        print('You win!')
        break
    letter = input('Guess a letter: ').lower()
    if len(letter) != 1 or letter in guessed:
        continue
    guessed.append(letter)
    if letter not in secret:
        attempts -= 1
else:
    print('Out of tries! The word was', secret)
~~~
The |else| on a |while| loop runs only when the loop ends without |break|.
> Try adding a hint that reveals the first letter.` }),
  mk({ id: 'javagui', title: 'Set up a GUI with Java', lang: 'Java', chips: ['Java'], level: 'Beginner', mins: 25, date: 'Oct 20, 2026', ts: 20261020, au: 'lena', cover: 'javagui', likes: 410, saves: 388, comments: 61, courses: [],
    pre: 'Java basics (classes and methods)', ver: 'Java 17', tags: ['Java', 'Beginner'],
    res: [['Java Swing tutorial', 'https://docs.oracle.com/javase/tutorial/uiswing/']], body: `
# Introduction
Swing is Java's built-in toolkit for desktop windows. In this project you build a small profile editor window with a menu of buttons.
# Create the window
A |JFrame| is the window itself. Give it a title, a size and tell it to quit when closed.
~~~
import javax.swing.*;
import java.awt.*;

public class ProfileEditor {
    public static void main(String[] args) {
        JFrame frame = new JFrame("Edit Profile");
        frame.setSize(420, 300);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
~~~
# Add a menu of buttons
~~~
        JPanel menu = new JPanel(new GridLayout(4, 1, 4, 4));
        for (String name : new String[]{"Title Color", "Backgrounds", "Outfit", "Download"}) {
            JButton b = new JButton(name);
            b.addActionListener(e -> JOptionPane.showMessageDialog(frame, name + " clicked"));
            menu.add(b);
        }
        frame.add(menu, BorderLayout.EAST);
        frame.setVisible(true);
    }
}
~~~
Compile with |javac ProfileEditor.java| and run with |java ProfileEditor|.
> A layout manager decides where components go, so you do not place pixels by hand.` }),
  mk({ id: 'keyframes', title: 'Animate Images with CSS keyframes', lang: 'HTML', chips: ['HTML'], level: 'Beginner', mins: 15, date: 'Oct 14, 2026', ts: 20261014, au: 'maya', cover: 'keyframes', likes: 702, saves: 655, comments: 83, courses: ['css'],
    pre: 'HTML and CSS basics', ver: 'Any modern browser', tags: ['HTML', 'Beginner'],
    res: [['MDN: CSS animations', 'https://developer.mozilla.org/en-US/docs/Web/CSS/animation']],
    demo: '<style>body{margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#dbeafe}.gem{width:46px;height:46px;background:#7c3aed;border:4px solid #c4b5fd;animation:float 3s ease-in-out infinite}@keyframes float{0%{transform:translateY(0) rotate(0)}50%{transform:translateY(-30px) rotate(180deg)}100%{transform:translateY(0) rotate(360deg)}}</style><div class="gem"></div>', body: `
# Introduction
CSS can animate things without any JavaScript. You describe a few key moments, called keyframes, and the browser fills in everything in between.
# Define the keyframes
~~~
@keyframes float {
  0%   { transform: translateY(0) rotate(0deg); }
  50%  { transform: translateY(-30px) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
}
~~~
# Apply the animation
~~~
.gem {
  animation: float 3s ease-in-out infinite;
}
~~~
|3s| is the duration, |ease-in-out| makes the motion smooth, and |infinite| repeats it forever. Here is the result running live:
@demo
> Change the percentages and watch how the motion changes.` }),
  mk({ id: 'aiblog', title: 'Generate a Blog with an AI API', lang: 'AI', chips: ['AI', 'Python'], level: 'Intermediate', mins: 30, date: 'Nov 10, 2026', ts: 20261110, au: 'omar', cover: 'aiblog', likes: 530, saves: 610, comments: 74, courses: ['ai', 'python'],
    pre: 'Python functions and the requests library', ver: 'Python 3.11, requests 2.31', tags: ['AI', 'Intermediate'],
    res: [['Python requests', 'https://pypi.org/project/requests/']], body: `
# Introduction
Many AI providers let your code ask a language model to write text. In this project you send a topic to an AI service and print the blog post that comes back.
@pipeline
# Keep your key secret
Never paste an API key into your code. Store it in an environment variable.
~~~
import os, requests

API_URL = 'https://api.example.com/v1/generate'   # use your provider's URL
KEY = os.environ['AI_API_KEY']
~~~
# Ask for a blog post
~~~
def write_blog(topic):
    prompt = f'Write a short, friendly blog post about {topic}.'
    r = requests.post(API_URL, headers={'Authorization': f'Bearer {KEY}'},
                      json={'prompt': prompt, 'max_tokens': 400}, timeout=30)
    r.raise_for_status()
    return r.json()['text']

print(write_blog('learning to code'))
~~~
> Every provider names its URL and fields differently. Check your provider's documentation and adjust the request.` }),
  mk({ id: 'search', title: 'Build a Search Engine with Python', lang: 'AI', chips: ['AI', 'Python'], level: 'Advanced', mins: 35, date: 'Nov 6, 2026', ts: 20261106, au: 'ravi', cover: 'search', likes: 455, saves: 497, comments: 52, courses: ['python'],
    pre: 'Python dictionaries, sets and functions', ver: 'Python 3.11', tags: ['Python', 'Advanced'],
    res: [['Python sets', 'https://docs.python.org/3/tutorial/datastructures.html#sets']], body: `
# Introduction
Search engines do not read every page for each query. They build an index first: a map from each word to the pages that contain it. You will build a tiny version.
@search
# Build the index
~~~
docs = {1: 'learn python fast', 2: 'python and sql for data', 3: 'build a mobile app'}
index = {}
for doc_id, text in docs.items():
    for word in text.split():
        index.setdefault(word, set()).add(doc_id)
~~~
# Search the index
Look up every word and keep the pages that appear in all the results.
~~~
def search(query):
    sets = [index.get(w, set()) for w in query.lower().split()]
    return set.intersection(*sets) if sets else set()

print(search('python data'))   # {2}
~~~
> Ideas to try next: rank results by how often the word appears, and ignore words like |a| and |and|.` }),
  mk({ id: 'voice', title: 'Create a Voice Virtual Assistant', lang: 'AI', chips: ['AI', 'Python'], level: 'Intermediate', mins: 30, date: 'Oct 30, 2026', ts: 20261030, au: 'omar', cover: 'voice', likes: 388, saves: 421, comments: 40, courses: ['python', 'aifund'],
    pre: 'Python functions and installing packages', ver: 'Python 3.11, SpeechRecognition, pyttsx3', tags: ['Python', 'Intermediate'],
    res: [['SpeechRecognition', 'https://pypi.org/project/SpeechRecognition/'], ['pyttsx3', 'https://pypi.org/project/pyttsx3/']], body: `
# Introduction
A voice assistant works like an agent: it listens, decides what you meant, and answers out loud.
@agent
# Install the tools
~~~
pip install SpeechRecognition pyttsx3 pyaudio
~~~
# Speak and listen
~~~
import speech_recognition as sr
import pyttsx3

engine = pyttsx3.init()
listener = sr.Recognizer()

def speak(text):
    engine.say(text)
    engine.runAndWait()
~~~
# Understand a command
~~~
with sr.Microphone() as mic:
    speak('How can I help?')
    audio = listener.listen(mic)
command = listener.recognize_google(audio).lower()

if 'time' in command:
    from datetime import datetime
    speak('It is ' + datetime.now().strftime('%H:%M'))
else:
    speak('Sorry, I did not understand.')
~~~
> |recognize_google| needs an internet connection to turn speech into text.` }),
  mk({ id: 'poem', title: 'Generate a Poem with an AI Model', lang: 'JavaScript', chips: ['AI', 'JavaScript'], level: 'Intermediate', mins: 25, date: 'Nov 12, 2026', ts: 20261112, au: 'omar', cover: 'poem', likes: 297, saves: 330, comments: 31, courses: ['js'],
    pre: 'JavaScript fetch and async/await', ver: 'Any modern browser or Node 18+', tags: ['JavaScript', 'Intermediate'],
    res: [['MDN: Fetch API', 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API']], body: `
# Introduction
Language models can write poems on any theme. Here you send a theme to an AI service with |fetch| and show the poem on the page.
@pipeline
# Send the request
~~~
async function writePoem(theme) {
  const res = await fetch('https://api.example.com/v1/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + KEY },
    body: JSON.stringify({ prompt: 'Write a four-line poem about ' + theme }),
  });
  const data = await res.json();
  return data.text;
}
~~~
# Show it
~~~
writePoem('the sea').then((poem) => {
  document.getElementById('poem').textContent = poem;
});
~~~
> Never put a secret API key in browser code. Call the AI from a small server and let the page talk to your server instead.` }),
  mk({ id: 'localhost', title: 'Run a Website Locally with HTML', lang: 'HTML', chips: ['HTML'], level: 'Beginner', mins: 10, date: 'Sep 30, 2026', ts: 20260930, au: 'aiko', cover: 'localhost', likes: 350, saves: 340, comments: 22, courses: ['html'],
    pre: 'A text editor and a browser', ver: 'Python 3 (for the small server)', tags: ['HTML', 'Beginner'],
    res: [['MDN: What is a web server?', 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_web_server']],
    demo: '<body style="font-family:sans-serif;text-align:center;padding:24px"><h2>Hello from localhost!</h2><button onclick="n.textContent=++c" style="padding:8px 16px">Clicks: <b id="n">0</b></button><script>var c=0</script></body>', body: `
# Introduction
Opening an HTML file works, but a local server behaves like the real web. The address |localhost| (also |127.0.0.1|) always means your own computer.
@arch
# Make a page
Create |index.html| in a new folder with a heading and a button, like this live example:
@demo
# Start a server
Open a terminal in that folder and run:
~~~
python -m http.server 8000
~~~
# Visit it
Open |http://localhost:8000| in your browser. Edit the file, refresh the page, and your change appears.
> Press Ctrl+C in the terminal to stop the server.` }),
  mk({ id: 'react', title: 'Create a Web App with React', lang: 'React', chips: ['React', 'JavaScript'], level: 'Intermediate', mins: 30, date: 'Oct 6, 2026', ts: 20261006, au: 'aiko', cover: 'react', likes: 520, saves: 560, comments: 66, courses: ['js'],
    pre: 'JavaScript basics and Node.js installed', ver: 'Node 20, Vite 5', tags: ['React', 'Intermediate'],
    res: [['React documentation', 'https://react.dev'], ['Vite guide', 'https://vite.dev/guide/']], body: `
# Introduction
Vite is a fast tool that sets up a React project in seconds and reloads the page as you type.
@lifecycle
# Create the project
~~~
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
~~~
Open the address Vite prints, usually |http://localhost:5173|.
# Your first component
Replace the contents of |src/App.jsx|:
~~~
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
~~~
> Save the file and the browser updates instantly.` }),
  mk({ id: 'deploy', title: 'Deploy a Website with GitHub Pages', lang: 'JavaScript', chips: ['JavaScript', 'HTML'], level: 'Intermediate', mins: 20, date: 'Oct 9, 2026', ts: 20261009, au: 'aiko', cover: 'deploy', likes: 300, saves: 380, comments: 28, courses: ['html'],
    pre: 'A GitHub account and Git installed', ver: 'Git 2.4x', tags: ['JavaScript', 'Intermediate'],
    res: [['GitHub Pages docs', 'https://docs.github.com/en/pages']], body: `
# Introduction
Deploying means putting your site on a server so anyone can open it. GitHub Pages hosts simple websites for free from a repository.
@devcycle
# Push your code
~~~
git init
git add .
git commit -m "First version"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/my-site.git
git push -u origin main
~~~
# Turn on Pages
On GitHub open your repository, go to |Settings|, then |Pages|. Under |Build and deployment| choose |Deploy from a branch|, pick |main| and the |/ (root)| folder, then save.
# Visit your site
After a minute your site appears at |https://YOUR-NAME.github.io/my-site/|.
> Every time you push a change, the site updates itself.` }),
  mk({ id: 'debug', title: 'Debug Your Web App in VS Code', lang: 'JavaScript', chips: ['JavaScript'], level: 'Intermediate', mins: 20, date: 'Sep 22, 2026', ts: 20260922, au: 'aiko', cover: 'debug', likes: 270, saves: 300, comments: 19, courses: ['js'],
    pre: 'VS Code installed and a small web project', ver: 'VS Code 1.9x', tags: ['JavaScript', 'Intermediate'],
    res: [['VS Code: debugging', 'https://code.visualstudio.com/docs/editor/debugging']], body: `
# Introduction
Debugging means finding why code does something unexpected. Instead of sprinkling |console.log| everywhere, you can pause the program and look inside.
# Set a breakpoint
Click in the gutter next to a line number. A red dot appears. The program will pause there.
# Launch the debugger
Create |.vscode/launch.json| so VS Code can open your page in a browser:
~~~
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Open localhost",
      "url": "http://localhost:5173",
      "webRoot": "\${workspaceFolder}"
    }
  ]
}
~~~
Press |F5|. When the breakpoint is hit, use |F10| to step over a line, |F11| to step into a function, and the Variables panel to see current values.
> Add an expression to the Watch panel to track it as you step.` }),
  mk({ id: 'game', title: 'Add Interactable Objects to Your 2D Game', lang: 'Game Dev', chips: ['Game Dev'], level: 'Intermediate', mins: 35, date: 'Nov 8, 2026', ts: 20261108, au: 'lena', cover: 'game', likes: 612, saves: 590, comments: 70, courses: ['game'],
    pre: 'A basic 2D scene in the Godot engine', ver: 'Godot 4.x', tags: ['Game Dev', 'Intermediate'],
    res: [['Godot documentation', 'https://docs.godotengine.org/']], body: `
# Introduction
Games feel alive when you can press a key to interact with things: open a chest, pick up an item, talk to a character. The trick is detecting when the player is close enough.
@gameloop
# Make the object an Area2D
Add an |Area2D| node with a collision shape around your box. Connect its |body_entered| and |body_exited| signals to a script.
# The script
~~~
extends Area2D

var player_near = false

func _on_body_entered(body):
    if body.name == "Player":
        player_near = true

func _on_body_exited(body):
    if body.name == "Player":
        player_near = false

func _process(_delta):
    if player_near and Input.is_action_just_pressed("interact"):
        print("You picked up the box!")
~~~
In Project Settings, open Input Map and add an action named |interact| bound to the E key.
> Show a small E hint above the object while |player_near| is true.` }),
  mk({ id: 'rave', title: 'Build a Pocket Rave with Arduino', lang: 'C++', chips: ['C++'], level: 'Intermediate', mins: 40, date: 'Oct 3, 2026', ts: 20261003, au: 'lena', cover: 'rave', likes: 340, saves: 305, comments: 27, courses: [],
    pre: 'An Arduino board, a small OLED screen and basic C++', ver: 'Arduino IDE 2, Adafruit SSD1306 library', tags: ['C++', 'Intermediate'],
    res: [['Arduino language reference', 'https://docs.arduino.cc/language-reference/']], body: `
# Introduction
An OLED screen can show text and tiny animations. You will make a pocket device that flashes a message and a dancing figure.
@loop
# Wire it up
Connect the screen's power and ground, then its two data pins (SDA and SCL) to the matching pins on your board.
# Show a message
~~~
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);

void setup() {
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.setTextColor(WHITE);
}

void loop() {
  display.clearDisplay();
  display.setCursor(10, 20);
  display.print("dance!");
  display.display();
  delay(300);
}
~~~
|setup| runs once, and |loop| repeats forever, so the message is redrawn every 300 milliseconds.
> Draw a stick figure with |drawLine| and change its arms each loop to make it dance.` }),
  mk({ id: 'pet', title: 'Create a Profile Pet with GraphQL', lang: 'JavaScript', chips: ['JavaScript'], level: 'Intermediate', mins: 35, date: 'Oct 25, 2026', ts: 20261025, au: 'omar', cover: 'pet', likes: 450, saves: 402, comments: 45, courses: ['js'],
    pre: 'JavaScript async code and a GitHub account', ver: 'Node 20', tags: ['JavaScript', 'Intermediate'],
    res: [['GitHub GraphQL API', 'https://docs.github.com/en/graphql']], body: `
# Introduction
A profile pet shows how many days in a row you have been coding. GraphQL lets you ask an API for exactly the fields you need, nothing more.
@dataloop
# Write the query
~~~
const query = \`
query {
  user(login: "YOUR-NAME") {
    contributionsCollection {
      contributionCalendar {
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}\`;
~~~
# Call the API
~~~
const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
});
const data = await res.json();
~~~
# Count the streak
~~~
const days = data.data.user.contributionsCollection.contributionCalendar
  .weeks.flatMap((w) => w.contributionDays);
let streak = 0;
for (let i = days.length - 1; i >= 0 && days[i].contributionCount > 0; i--) streak++;
console.log('Streak:', streak, 'days');
~~~
> Use the streak number to pick a mood for your pet: sleepy, happy or on fire.` }),
  mk({ id: 'plant', title: 'Build a Plant Buddy App with Electron', lang: 'JavaScript', chips: ['JavaScript'], level: 'Intermediate', mins: 30, date: 'Sep 15, 2026', ts: 20260915, au: 'aiko', cover: 'plant', likes: 260, saves: 241, comments: 15, courses: ['js'],
    pre: 'HTML, CSS and JavaScript basics', ver: 'Node 20, Electron 3x', tags: ['JavaScript', 'Intermediate'],
    res: [['Electron documentation', 'https://www.electronjs.org/docs/latest/']],
    demo: '<body style="font-family:sans-serif;text-align:center;padding:16px;background:#eefbe9"><div style="font-size:54px" id="p">🌱</div><h3 id="m">Thirsty</h3><button onclick="w()" style="padding:8px 16px">Water 💧</button><script>var n=0;function w(){n++;p.textContent=n<2?"🌱":n<5?"🪴":"🌳";m.textContent=n<2?"Thirsty":n<5?"Happy":"Thriving"}</script></body>', body: `
# Introduction
Electron lets you build desktop apps with web technology. In this project you make a small window with a plant that gets happier when you water it. Try the idea below:
@demo
@lifecycle
# Set up the project
~~~
npm init -y
npm install --save-dev electron
~~~
# Create the window
In |main.js|:
~~~
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({ width: 360, height: 480 });
  win.loadFile('index.html');
}
app.whenReady().then(createWindow);
~~~
Put your page in |index.html|, and set |"main": "main.js"| and a |"start": "electron ."| script in |package.json|. Run it with |npm start|.
> Save the water level in |localStorage| so your plant remembers it.` }),
  mk({ id: 'terminal', title: '12 Terminal Project Ideas with Python', lang: 'Python', chips: ['Python'], level: 'Beginner', mins: 15, date: 'Aug 28, 2026', ts: 20260828, au: 'maya', cover: 'terminal', likes: 720, saves: 805, comments: 90, courses: ['python'],
    pre: 'Python basics', ver: 'Python 3.11', tags: ['Python', 'Beginner'],
    res: [['Python documentation', 'https://docs.python.org/3/']], body: `
# Introduction
Terminal programs need no graphics, so you can focus on logic. Here are twelve ideas, each small enough to finish in an evening.
# Starter ideas
~~~
1. Number guessing game
2. Rock, paper, scissors
3. Tip calculator
4. Unit converter
5. Password generator
6. To-do list saved to a file
~~~
# Next-level ideas
~~~
7. Quiz game with a score
8. Flashcards from a text file
9. Simple bank account simulator
10. Dice roller with statistics
11. Text adventure with rooms
12. Habit tracker with streaks
~~~
Pick one and start with the smallest version that works: one input, one output. Then add features one at a time.
> Finishing small projects teaches more than abandoning big ones.` }),
  mk({ id: 'sqlite', title: 'Analyze Streaming Data with SQLite', lang: 'Data Science', chips: ['Data Science', 'Python'], level: 'Beginner', mins: 25, date: 'Sep 4, 2026', ts: 20260904, au: 'ravi', cover: 'sqlite', likes: 380, saves: 410, comments: 36, courses: ['sql', 'pandas'],
    pre: 'Basic Python and SQL', ver: 'Python 3.11 (sqlite3 is built in)', tags: ['Data Science', 'Beginner'],
    res: [['SQLite documentation', 'https://www.sqlite.org/docs.html']], body: `
# Introduction
SQLite is a tiny database that lives in a single file, and Python can talk to it with no installs. You will store viewing numbers and ask which category is most popular.
@table
# Create and fill a table
~~~
import sqlite3

con = sqlite3.connect('streams.db')
cur = con.cursor()
cur.execute('CREATE TABLE IF NOT EXISTS streams (game TEXT, viewers INTEGER)')
cur.executemany('INSERT INTO streams VALUES (?, ?)',
                [('Puzzle', 120), ('Racing', 340), ('Puzzle', 80)])
con.commit()
~~~
# Ask a question
~~~
query = 'SELECT game, SUM(viewers) FROM streams GROUP BY game ORDER BY 2 DESC'
for row in cur.execute(query):
    print(row)
~~~
The query groups rows by game, adds up the viewers and sorts the biggest first.
> The |?| placeholders keep user input safe from SQL injection.` }),
];

export const SECTIONS = [
  ['🌱', 'Beginner-friendly picks', 'New to building? Start with these small, friendly projects that pair well with our beginner courses.', ['gif', 'word', 'javagui', 'keyframes']],
  ['🤖', 'Get AI-ready', 'Curious about AI? Build small projects that show what modern AI tools can do.', ['aiblog', 'search', 'voice', 'poem']],
  ['🚀', 'Hackathon starter pack', 'Quick guides for setting up your tools and putting your app online.', ['localhost', 'react', 'deploy', 'debug']],
];
export const CHIPS = ['All', 'Python', 'HTML', 'JavaScript', 'React', 'C++', 'AI', 'Data Science', 'Java', 'Game Dev'];
