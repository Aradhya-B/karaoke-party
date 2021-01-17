from AudioAnalyzer import *

original = AudioAnalyzer(
    "../score_testing/clips/I said, ooh, I'm blinded by the lights [0100.82].wav", input_sr=44100, fft_size=44100)

inst = AudioAnalyzer(
    "../score_testing/origClips/eddy_singing.wav", input_sr=44100, fft_size=44100)

orig_to_inst = SpectrumCompare(original, inst)

df = orig_to_inst.plot_spectrum_heatmap()
print(df)
