from googletrans import Translator

def translate(text, to):

    
    tarnslator = Translator()
    translated_text = tarnslator.translate(text, src='en', dest=to)

    return translated_text.text
