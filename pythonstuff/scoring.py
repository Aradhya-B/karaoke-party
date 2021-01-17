import aubio
from aubio import source, pitch, sink, digital_filter
from os import path
from scipy.io import wavfile

REAL_AUDIO = "../score_testing/clips/I said, ooh, I'm blinded by the lights [0100.82].wav"
RECORD_SECONDS = 240


def calculateScore(audio_file_one, audio_file_two):
    file_one_pitches = getPitch(audio_file_one)
    file_two_pitches = getPitch(audio_file_two)
    score = min(100, round(pitchAlgorithm(userPitches, realPitches)))
    return score


def getPitch(filename):
    # buffer size (window size) - higher is good for lower frequencies
    win_s = 4096
    hop_s = 512
    s = source(filename)  # wav samplerate is 44.1kH
    tolerance = 0.8
    pitch_o = pitch("yin", win_s)
    pitch_o.set_unit("midi")
    pitch_o.set_tolerance(tolerance)
    pitches, confidences = [], []
    # total number of frames read
    total_frames = 0
    while True:
        samples, read = s()
        pitch = pitch_o(samples)[0]
        pitch = round(pitch, 3)
        confidence = pitch_o.get_confidence()
        if confidence < 0.60:
            pitch = 0
        pitches += [pitch]
        confidences += [confidence]
        total_frames += read
        if read < hop_s:
            break
    # concat = 4
    # pitches = pitches[concat:]
    # confidences = confidences[concat:]
    return pitches


def convertPitchesToNotes(pitches):
    pitchDict = makePitchMap()
    notes = []
    for pitch in pitches:
        rounded_pitch = int(round(pitch))
        if rounded_pitch in pitchDict:
            notes += [pitchDict[rounded_pitch]]
        else:
            notes += [0]
    return notes


def makePitchMap():
    dictionary = {}
    for i in range(0, 7):
        key = 24 + i*12
        dictionary[key] = 'C' + str(i + 1)

        key = 25 + i*12
        dictionary[key] = 'C#' + str(i + 1)

        key = 26 + i*12
        dictionary[key] = 'D' + str(i + 1)

        key = 27 + i*12
        dictionary[key] = 'D#' + str(i + 1)

        key = 28 + i*12
        dictionary[key] = 'E' + str(i + 1)

        key = 29 + i*12
        dictionary[key] = 'F' + str(i + 1)

        key = 30 + i*12
        dictionary[key] = 'F#' + str(i + 1)

        key = 31 + i*12
        dictionary[key] = 'G' + str(i + 1)

        key = 32 + i*12
        dictionary[key] = 'G#' + str(i + 1)

        key = 33 + i*12
        dictionary[key] = 'A' + str(i + 1)

        key = 34 + i*12
        dictionary[key] = 'A#' + str(i + 1)

        key = 35 + i*12
        dictionary[key] = 'B' + str(i + 1)

    dictionary[108] = 'C8'

    return dictionary


def pitchAlgorithm(userPitches, realPitches):
    interval = round(len(realPitches)/(RECORD_SECONDS*4))
    userPitches = reduceWhiteNoise(userPitches, realPitches)
    # concatenate extra frames
    begin, end = 0, 0
    for i in range(len(userPitches) - 1):
        if int(userPitches[i]) == 0 and int(userPitches[i+1] != 0):
            begin = i + 1
            break
    for j in range(len(userPitches) - 1, begin, -1):
        if int(userPitches[j-1]) != 0 and int(userPitches[j]) == 0:
            end = j
            break
    userPitches = userPitches[begin:end]
    realPitches = realPitches[begin:end]
    userNotes = convertPitchesToNotes(userPitches)
    realNotes = convertPitchesToNotes(realPitches)
    score = 0
    total = min(len(userNotes), len(realNotes))

    for i in range(0, len(realNotes)-interval, interval):
        # window for freq: 1/3 of a second
        for j in range(-1*interval//2, interval//2, 1):
            if realNotes[i+j] == 0 and userNotes[i+j] == 0:
                score += 1
            elif realNotes[i+j] == 0 or userNotes[i+j] == 0:
                score += 1
            elif (compareNotes(realNotes[i], userNotes[i+j])):
                score += 1
    # for i in range(min(len(userNotes), len(realNotes) )):
        # if (not isinstance(userNotes[i], str) and isinstance(realNotes[i], str)):
        #	total -=1
        # if compareNotes(realNotes[i], userNotes[i]):
        #	score+=1
    return score/total*100


def compareNotes(A, B):
    if isinstance(A, float):
        A = int(A)
    if isinstance(B, float):
        B = int(B)
    if (A == 0 and B == 0):
        return True
    elif isinstance(A, str) and isinstance(B, str) and A[0:2] == B[0:2]:
        return True
    return False


def reduceWhiteNoise(userArray, realArray):
    # 20 samples per second
    interval = 10
    # beginning case
    if (userArray[:5] != [0]*5):
        userArray[0] = 0
    # end case
    if (userArray[-5:] != [0]*5):
        userArray[-1] = 0
    for i in range(len(userArray)-interval):
        if (userArray[i:i+interval//2-1] == [0]*(interval//2-1) and userArray[i+interval//2+1: i+interval] == [0]*(interval//2-1)):
            if userArray[i+interval//2-1:i+interval//2+1] != realArray[i+interval//2-1:i+interval//2+1]:
                userArray[i+interval//2-1] = 0
                userArray[i+interval//2] = 0
    return userArray
