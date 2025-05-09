import axios from 'axios'
import { default as inquirer } from 'inquirer'
import { readFile } from 'fs/promises'

const config = JSON.parse(await readFile(new URL('../config.json', import.meta.url), 'utf8'))
const { authentication: AUTH, commands } = config

console.log('\n')

inquirer
  .prompt([
    {
      type: 'input',
      name: 'domain',
      message: `Enter published domain name :`,
    },
  ])
  .then((answer) => {
    return Promise.all([
      postTelegramAPI('setWebhook', {
        url: `${answer.domain}/webhook/telegram`,
      }),
      postTelegramAPI('setMyCommands', { commands: commands }),
    ])
  })
  .catch((error) => {
    console.error(error.response?.data?.description || error.message || error)
  })

/**
 * @param {String} method
 * @param {Object} payload
 * @returns {Promise}
 */
function postTelegramAPI(method, payload) {
  return axios.post(`https://api.telegram.org/bot${AUTH.telegramApiToken}/${method}`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
