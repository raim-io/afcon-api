import Team from 'App/Models/Team'
import Factory from '@ioc:Adonis/Lucid/Factory'

const TeamFactory = Factory.define(Team, ({ faker }) => {
  return {
    name: `Team ${faker.address.country()} ${faker.random.word()}`,
    alias: (() => {
      const omit = faker.datatype.boolean()
      return omit ? null : faker.random.words()
    })(),
  }
}).build()

export default TeamFactory
