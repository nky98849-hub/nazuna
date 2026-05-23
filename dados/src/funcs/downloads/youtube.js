import yts from 'yt-search'
import { execSync } from 'child_process'
import fs from 'fs'

async function search(query) {
  try {
    const result = await yts(query)
    const video = result.videos[0]

    return {
      ok: true,
      data: video
    }

  } catch (err) {
    return { ok: false, msg: err.message }
  }
}

async function mp3(query) {
  try {
    const result = await yts(query)
    const video = result.videos[0]

    if (!video?.url) {
      throw new Error('Vídeo não encontrado')
    }

    const filename = `audio_${Date.now()}.mp3`

    execSync(
      `yt-dlp -x --audio-format mp3 -o "${filename}" "${video.url}"`
    )

    const buffer = fs.readFileSync(filename)

    fs.unlinkSync(filename)

    return {
      ok: true,
      buffer,
      title: video.title,
      thumbnail: video.thumbnail,
      filename: `${video.title}.mp3`
    }

  } catch (err) {
    return { ok: false, msg: err.message }
  }
}

async function mp4(query) {
  return await mp3(query)
}

export {
  search,
  mp3,
  mp4
}
