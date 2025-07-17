export const isStarred = (mail: Mail) => {
  return mail.labels.includes('STARRED')
}

export const toStarred = (mail: Mail): Mail => {
  const cloned = structuredClone(mail)
  cloned.labels.push('STARRED')
  return cloned
}

export const toUnstarred = (mail: Mail): Mail => {
  const cloned = structuredClone(mail)
  cloned.labels = cloned.labels.filter(l => l !== 'STARRED')
  return cloned
}

export const toStarToggled = (mail: Mail): Mail =>
  isStarred(mail)
    ? toUnstarred(mail)
    : toStarred(mail)

export function isSameMail(mail1: Mail, mail2: Mail) {
  return mail1.id === mail2.id
}
