import { authentication, createDirectus, rest } from '@directus/sdk'

const directus = createDirectus('https://directusemprendedores.lucasgonzalez.gob.ar')
  .with(authentication('json'))
  .with(rest())

export default directus
