// ========================
//   ClipMaker - script.js
// ========================

// Elementos do DOM
const el = {
    loading:      document.getElementById('loading'),
    loadingText:  document.getElementById('loadingText'),
    video:        document.getElementById('video'),
    error:        document.getElementById('error'),
    errorMessage: document.getElementById('errorMessage'),
    placeholder:  document.getElementById('placeholder'),
    apiKey:       document.getElementById('apiKey'),
    button:       document.getElementById('uploadWidget')
}

// Configurações da Cloudinary
const config = {
    cloudName:    'ddjtg9eiz',
    uploadPreset: 'upload_projeto'
}

// Configurações do Gemini
const gemini = {
    model:    'gemini-2.0-flash',
    endpoint: function() {
        return `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`
    }
}

// Estado e ações do app
const app = {
    public_id: '',

    // Manda o vídeo para o Gemini transcrever
    getTranscription: async (videoInfo) => {
        const videoURL = `https://res.cloudinary.com/${config.cloudName}/video/upload/v${videoInfo.version}/${videoInfo.public_id}.${videoInfo.format}`

        console.log('Transcrevendo vídeo:', videoURL)

        const contents = [{
            parts: [
                {
                    file_data: {
                        mime_type: 'video/mp4',
                        file_uri: videoURL
                    }
                },
                {
                    text: 'Transcreva todo o áudio deste vídeo em texto corrido, mantendo a ordem cronológica.'
                }
            ]
        }]

        const response = await fetch(gemini.endpoint(), {
            method: 'POST',
            headers: {
                'x-goog-api-key': el.apiKey.value,
                'content-type': 'application/json'
            },
            body: JSON.stringify({ contents })
        })

        if (!response.ok) {
            throw new Error(`Erro ao transcrever: HTTP ${response.status}`)
        }

        const data = await response.json()
        const transcription = data.candidates[0].content.parts[0].text
        console.log('Transcrição:', transcription)
        return transcription
    },

    // Manda a transcrição para o Gemini encontrar o momento viral
    getViralMoment: async (transcription) => {
        const prompt = `
Role: You are a professional video editor specializing in viral content.
Task: Analyze the transcription below and identify the most engaging, funny, or surprising segment.
Constraints:
1. Duration: Minimum 30 seconds, Maximum 60 seconds.
2. Format: Return ONLY the start and end string for Cloudinary. Format: so_<start_seconds>,eo_<end_seconds>
3. Examples: "so_10,eo_20" or "so_12.5,eo_45.2"
4. CRITICAL: Do not use markdown, do not use quotes, do not explain. Return ONLY the raw string.

Transcription:
${transcription}`

        const contents = [{ parts: [{ text: prompt }] }]

        const maxAttempts = 3
        const delay = 3000

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const response = await fetch(gemini.endpoint(), {
                    method: 'POST',
                    headers: {
                        'x-goog-api-key': el.apiKey.value,
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({ contents })
                })

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }

                const data = await response.json()
                const rawText = data.candidates[0].content.parts[0].text.trim()
                return rawText.replace(/```/g, '').replace(/json/g, '').trim()

            } catch (error) {
                const isLastAttempt = attempt === maxAttempts
                console.log(`Tentativa ${attempt}/${maxAttempts} falhou: ${error.message}`)
                if (isLastAttempt) throw error
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }
    }
}

// Widget de upload da Cloudinary
const myWidget = cloudinary.createUploadWidget(
    config,
    async (error, result) => {
        if (!error && result && result.event === 'success') {
            console.log('Upload concluído:', result.info)
            app.public_id = result.info.public_id

            try {
                el.loading.classList.remove('hidden')
                el.error.classList.add('hidden')

                // Passo 1 — transcrever com Gemini
                el.loadingText.innerText = 'Transcrevendo vídeo com IA...'
                const transcription = await app.getTranscription(result.info)

                // Passo 2 — encontrar momento viral
                el.loadingText.innerText = 'Encontrando momento viral...'
                const viralMoment = await app.getViralMoment(transcription)

                // Passo 3 — montar URL e mostrar vídeo
                const viralMomentURL = `https://res.cloudinary.com/${config.cloudName}/video/upload/${viralMoment}/${app.public_id}.mp4`
                console.log('URL do clipe viral:', viralMomentURL)

                el.video.setAttribute('src', viralMomentURL)
                el.video.classList.remove('hidden')
                el.placeholder.classList.add('opacity-0')

                gsap.from(el.video, {
                    opacity: 0,
                    scale: 0.97,
                    duration: 1,
                    ease: 'expo.out'
                })

            } catch (e) {
                console.log({ e })
                el.errorMessage.innerText = e.message || 'Erro inesperado'
                el.error.classList.remove('hidden')
            } finally {
                el.loading.classList.add('hidden')
            }
        }
    }
)

// Abre o widget ao clicar no botão
el.button.addEventListener('click', () => {
    if (!el.apiKey.value) {
        alert('Por favor, insira sua API Key do Gemini primeiro.')
        el.apiKey.focus()
        return
    }
    myWidget.open()
})

// Inicializa ícones do Lucide
lucide.createIcons()

// Animações de entrada com GSAP
window.addEventListener('load', () => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.4 } })
    tl.to('.nav-el',   { opacity: 1, y: 0 })
      .to('.hero-el',  { opacity: 1, y: 0 }, '-=1.1')
      .to('.cta-el',   { opacity: 1, y: 0 }, '-=1.0')
      .to('.video-el', { opacity: 1, y: 0 }, '-=0.9')
})
