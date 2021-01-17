## Inspiration

Covid bad, pandemic sucks. By now you've already heard countless times how the pandemic has changed everything... enough is enough, right?  Well, not much has changed. We are still on lock down. Friends and family are just pixels on a screen.... we are alone. But what if that weren't the case? What if we could flip the script and enjoy each other's company without being in each other's company?

**The answer is Karaoke Party**. We took the classic karaoke experience and brought it to our times. Through song and melody we will heal, **we will come together and make it through.** 

## What it does

Karaoke Party is a web application for friends looking to sing today's greatest hits. The process is incredibly simple. Once you launch Karaoke Party, you can create/join a room and invite your friends.  Then choose a song of your choice. This is where the fun begins. When you're ready, hit play. The lyrics will start rolling down the screen and you can start singing! Our audio comparison algorithim will compare your beautiful voice to the actual audio of the song and assign points based on how close you were in real time. By the end of the song all your points will be finalized. Now, _finally_,  you will be able to tell once and for all who amongst your friends has the voice of an angel!

## How we built it
### Audio Similarity  and Scoring Algorithm
For every song in our playlist, we’ve used an lrc file to dynamically slice the song into its primary bars that players will sing in rotation. Karaoke party records each bar sung by a participant and sends it to our server, where it’s converted into a WAV file and compared with the same clip but sung by the song’s original singer. We extract the pitches from the audio files using the Yin algorithm and map pitches at individual frames to musical notes. The similarity of the notes over the duration of the entire clip determines the player’s score for that particular bar and once a score is determined, it is sent to all clients through websockets to ensure everybody knows who's in the lead at all times.


### Frontend
Karaoke Party is built on an unique architecture to give our users the best karaoke experience. Our front end is built with React which allows us to offer a unique modern UI design combined with images to stay connected with your favorite singers. The video chat capability of the app is built in Agora.io. Agora.io  dealt with a large portion of the boiler plate; things like video routing, rooms, and dynamic displays  — which when we combined with web sockets, helped us create an engaging, real-time experience. 

## Challenges we ran into
We ran into and overcame many challenges while building Karaoke Party.  First and foremost, Socket.io. Our use of Socket.io was unique. A flask server with a react  front-end is an atypical structure, There wasn't much in the way of documentation and tutorials for this specific configuration of sockets. This translated into having dig deep into the documentation for flask-socketIO, having only with a variety of obscure medium articles to guide us as well. We made it through and it was incredibly rewarding. Another significant issue we faced was syncing  the lrc slices to the user's audio, we were consistently off by one line. Despite our lack of sleep,  we were able to solve the issue by simply indexing the slices, so as to match audio chunks with their corresponding line in the song. It worked beautifully and we're so happy it worked out the way it did. 

## Accomplishments that we're proud of
Not to brag or anything, but we killed it with the audio similarity and scoring algorithm. At first the task of audio comparisons seemed daunting . How do you deal with the delay?  How do you isolate the voice from the instrumental?  Once we found out about  lrc files for music, we began to put the pieces together, it all sort of clicked. Our delegation of tasks was also something to proud of too. We all handled our own assigned parts masterfully and we couldn't be more proud of the final result.  . 

## What we learned
Our team learned how to use a react front end with a flask/python backend server which was a really interesting challenge. also, we learned a lot more about CORS issues because we had to deal with a lot of those! Finally, we gained an appreciation for mimeTypes and which work in what browser, because that ended up throwing us for a loop too! 

## What's next for Karaoke Party
- Hosting 
- Fixing display and  video bugs, fixing lag
- Increasing song catalogue 
- Adding video/dynamic backgrounds

