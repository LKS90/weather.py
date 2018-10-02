from datetime import datetime
from flask import Flask, request, url_for
from yattag import Doc
app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def weather():
    config = {
        'city': 'Dübendorf',
        'lang': 'DE'
    }
    city = request.data
    if not city:
        city = config['city']
    return get_weather(city, config['lang'])

def get_weather(city, lang):
    doc, tag, text = Doc().tagtext()

    doc.asis('<!DOCTYPE html>')
    with tag('html'):
        with tag('title'):
                text('Wetter')
        with tag('head'):
            doc.stag('link', rel='stylesheet', type='text/css', href='https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800')
            doc.stag('link', rel='stylesheet', type='text/css', href=url_for('static', filename='style.css'))
            with tag('script', type='text/javascript'):
                text('var lang = \'' + lang + '\'')
                text('\n')
                text('var city = \'' + city + '\'')
            with tag('script', type='text/javascript', src=url_for('static', filename='weather.js')):
                text()
        with tag('body', id='main'):
            with tag('section', id='weather-container', klass='container'):
                with tag('form', action='#', onsubmit='return setCity()', method='get'):
                    doc.stag('input', type='text', name='city', id='name', placeholder='City', value=city)
                    doc.stag('input', type='button', value='➥', onclick='return setCity()')
                with tag('section', id='date'):
                    text(str(datetime.now().strftime('%H:%M - %d.%m.%Y')))
                with tag('section', id='data-table'):
                    with tag('section', id='data-current'):
                        with tag('section', id='label-now'):
                            text('Jetzt:')
                        with tag('section', id='temperature'):
                            text('#TEMPERATUR')
                        doc.stag('img', src=url_for('static', filename='spinner.svg'), id='weather-icon', alt='Loading...', height='50', width='50')
                        with tag('section', id='description'):
                            text('#BESCHREIBUNG')
                    with tag('section', id='data-forecast'):
                        with tag('section', id='label-forecast'):
                            text('Vorhersage:')
                        with tag('section', id='temperature-forecast'):
                            text('#VORHERSAGE TEMPERATUR')
                        doc.stag('img', src=url_for('static', filename='spinner.svg'), id='forecast-icon', alt='Loading...', height='50', width='50')
                        with tag('section', id='description-forecast'):
                            text('#VORHERSAGE BESCHREIBUNG')
            with tag('section', id='forecast-container', klass='container'):
                for i in range(0, 4):
                    with tag('section', id='day-' + str(i)):
                        with tag('section', id='forecast-day-' + str(i) + '-label'):
                            text('#WEEKDAY')
                        with tag('section', id='forecast-day-' + str(i) + '-temperature-label', klass='forecast-temp-label forecast-subcontainer'):
                            with tag('section', id='forecast-day-' + str(i) + '-temperature-label-morning'):
                                text('Morgens')
                            with tag('section', id='forecast-day-' + str(i) + '-temperature-label-day', klass='center-label'):
                                text('Mittags')
                            with tag('section', id='forecast-day-' + str(i) + '-temperature-label-night'):
                                text('Abends')
                        with tag('section', id='forecast-day-' + str(i) + '-temperature', klass='forecast-temp forecast-subcontainer'):
                            with tag('section', id='forecast-day-' + str(i) + '-temperature-morning'):
                                text('# X°C')
                            with tag('section', id='forecast-day-' + str(i) + '-temperature-day', klass='center-temp'):
                                text('# Y°C')
                            with tag('section', id='forecast-day-' + str(i) + '-temperature-night'):
                                text('# Z°C')
                        with tag('section', id='forecast-day-' + str(i) + '-icon-section', klass='forecast-subcontainer'):
                            doc.stag('img', src=url_for('static', filename='spinner.svg'), id='forecast-day-' + str(i) + '-icon', alt='Loading...', height='50', width='50')
                        with tag('section', id='forecast-day-' + str(i) + '-description', klass='forecast-subcontainer'):
                            text('#BESCHREIBUNG HEUTE+' + str(i+1) + ' Tage')
            with tag('section', id='description-container', klass='container'):
                with tag('section', id='wallpaper-description'):
                    text('#HINTERGRUND BESCHREIBUNG')

    return doc.getvalue()
