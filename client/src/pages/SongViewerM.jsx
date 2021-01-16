import React, { useCallback, useState, useRef } from 'react'
import { Lrc } from '@mebtte/react-lrc'
import musicList from '../assets/music'
import sound from '../assets/songs/blinding_lights.mp3'

const lrcStyle = {
    flex: 1,
    minHeight: 0,
}

const SongViewer = () => {
    const onCurrentLineChange = useCallback((line) => console.log(line), [])
    const currentMusic = musicList[0]
    const [currentTime, setCurrentTime] = useState(0)
    const onTimeUpdate = useCallback(
        (event) => setCurrentTime(event.target.currentTime),
        []
    )
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

    const lrcRef = useRef()
    return (
        <React.Fragment>
            <h1> Song Viewer Gang</h1>
            <audio
                //src={currentMusic.src}
                src={sound}
                autoPlay
                controls
                onTimeUpdate={onTimeUpdate}
            />
            <br />
            <button
                type="button"
                onClick={() =>
                    alert(JSON.stringify(lrcRef.current.getCurrentLine()))
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
            <hr />
            <Lrc
                ref={lrcRef}
                style={lrcStyle}
                lrc={currentMusic.lrc}
                currentTime={currentTime * 1000}
                lineRenderer={lineRenderer}
                onCurrentLineChange={onCurrentLineChange}
            />
        </React.Fragment>
    )
}

export default SongViewer
