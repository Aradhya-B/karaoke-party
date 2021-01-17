import React, { useState, useRef, useCallback } from 'react'
import { Lrc, useLrc } from '@mebtte/react-lrc'

import musicList from '../assets/music'
import { StyledApp, MusicList, Action } from './style'
import Music from './music'
import sound from '../assets/songs/blinding_lights.mp3'
const lrcStyle = {
    flex: 1,
    minHeight: 0,
}

const App = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const onTimeUpdate = useCallback(
        (event) => setCurrentTime(event.target.currentTime),
        []
    )
    // console.log({ blLrc })
    const lrcRef = useRef()
    const lineRenderer = useCallback(({ lrcLine, index, active }) => {
        const { content } = lrcLine
        return (
            <div
                style={{
                    textAlign: 'center',
                    padding: '10px 0',
                    color: active ? 'green' : 'inherit',
                    transform: `scale(${active ? 1.2 : 1})`,
                    transition: 'transform 300ms',
                }}
            >
                {content}
            </div>
        )
    }, [])
    const onCurrentLineChange = useCallback((line) => console.log(line), [])

    const currentMusic = musicList[0]

    return (
        <StyledApp
            style={{
                display: 'flex',
                direction: 'column',
                justifyContent: 'center',
            }}
        >
            <div className="top">
                <Action>
                    <audio
                        src={currentMusic.src}
                        controls
                        onTimeUpdate={onTimeUpdate}
                        id="song"
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

export default App
