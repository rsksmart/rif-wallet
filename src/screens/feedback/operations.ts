import axios from 'axios'
import Config from 'react-native-config'

export const sendFeedbackToGithub = (
  name: string,
  email: string,
  feedback: string,
) => {
  // hardcoding this value for now:
  const url = 'https://api.github.com/repos/rsksmart/rif-wallet-feedback/issues'
  const token = Config.GITHUB_ISSUES_TOKEN

  const body = `
${feedback}

---

**name:** ${name}
**email:** ${email}
**date**: ${new Date()}
`

  return axios.post(
    url,
    {
      title: 'User feedback',
      body,
      labels: ['app-reported', 'needs-triage'],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
