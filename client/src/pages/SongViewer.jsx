import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Lrc, useLrc } from '@mebtte/react-lrc'

import musicList from '../assets/music'
import { StyledApp, MusicList, Action } from './style'
import Music from './music'
import sound from '../assets/songs/blinding_lights.mp3'
import axios from 'axios'
import { URL } from '../config'

const lrcStyle = {
    flex: 1,
    minHeight: 0,
}

const SongViewer = ({ username }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const onTimeUpdate = useCallback(
        (event) => setCurrentTime(event.target.currentTime),
        []
    )
    // console.log({ blLrc })
    const lrcRef = useRef()
    const currentLineLrcRef = useRef()
    const lineIndexRef = useRef()

    const lineRenderer = useCallback(({ lrcLine, index, active }) => {
        const { content } = lrcLine
        return (
            <div
                style={{
                    textAlign: 'center',
                    padding: '10px 0',
                    fontSize: '3vw',
                    color: active ? 'yellow' : 'lightgrey',
                    transform: `scale(${active ? 1.2 : 1})`,
                    transition: 'transform 300ms',
                }}
            >
                {content}
            </div>
        )
    }, [])
    const onCurrentLineChange = useCallback((line) => {
        if (line.lrcLine) {
            console.log({ line })
            if (mediaRecorder.state === 'recording') mediaRecorder.stop()
            lineIndexRef.current = line.index

            mediaRecorder.start()
        }
    }, [])

    let mediaRecorder
    useEffect(() => {
        if (navigator.mediaDevices) {
            console.log('getUserMedia supported.')

            const constraints = { audio: true }
            let chunks = []

            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(function (stream) {
                    mediaRecorder = new MediaRecorder(stream, {
                        mimeType: 'audio/webm',
                    })

                    // mediaRecorder.start()

                    mediaRecorder.ondataavailable = function (e) {
                        chunks.push(e.data)
                    }

                    mediaRecorder.onstop = function (e) {
                        console.log(
                            'data available after MediaRecorder.stop() called.'
                        )

                        // var clipName = prompt(
                        //     'Enter a name for your sound clip'
                        // )

                        // var clipContainer = document.createElement('article')
                        // var clipLabel = document.createElement('p')
                        // var audio = document.createElement('audio')
                        // var deleteButton = document.createElement('button')

                        // clipContainer.classList.add('clip')
                        // audio.setAttribute('controls', '')
                        // deleteButton.innerHTML = 'Delete'
                        // clipLabel.innerHTML = clipName

                        // clipContainer.appendChild(audio)
                        // clipContainer.appendChild(clipLabel)
                        // clipContainer.appendChild(deleteButton)
                        // document
                        //     .getElementById('top')
                        //     .appendChild(clipContainer)

                        // audio.controls = true

                        // console.log({ chunks })
                        var blob = new Blob(chunks, {
                            type: 'audio/ogg; codecs=opus',
                        })
                        chunks = []

                        console.log({ currentLineLrcRef })
                        const formData = new FormData()
                        formData.append('file', blob)
                        formData.append(
                            'index',
                            lineIndexRef.current.toString()
                        )
                        formData.append('username', username)

                        const config = {
                            headers: {
                                'content-type': 'multipart/form-data',
                            },
                        }
                        return axios.post(`${URL}/upload`, formData, config)
                    }
                })
        }
    }, [])

    const currentMusic = musicList[0]

    const record = () => {
        mediaRecorder.start()
    }

    const stop = () => {
        mediaRecorder.stop()
    }

    return (
        <StyledApp
            style={{
                display: 'flex',
                direction: 'column',
                justifyContent: 'center',
            }}
        >
            <div className="top" id="top">
                <Action>
                    <audio
                        src={currentMusic.src}
                        controls
                        onTimeUpdate={onTimeUpdate}
                        id="song"
                        // onPlay={() => record()}
                    />
                    <br />
                    <button
                        type="button"
                        onClick={() =>
                            alert(
                                JSON.stringify(lrcRef.current.getCurrentLine())
                            )
                        }
                    >
                        get current line
                    </button>
                    <button type="button" onClick={() => record()}>
                        record
                    </button>
                    <button type="button" onClick={() => stop()}>
                        stop rec
                    </button>
                    <button
                        type="button"
                        onClick={() => lrcRef.current.scrollToCurrentLine()}
                    >
                        scroll to current line
                    </button>
                </Action>
            </div>
            <Lrc
                ref={lrcRef}
                style={lrcStyle}
                lrc={currentMusic.lrc}
                currentTime={currentTime * 1000}
                lineRenderer={lineRenderer}
                onCurrentLineChange={onCurrentLineChange}
            />
        </StyledApp>
    )
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000)
    var seconds = ((millis % 60000) / 1000).toFixed(0)
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

export default SongViewer
