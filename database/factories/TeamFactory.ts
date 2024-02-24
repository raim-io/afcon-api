import Team from 'App/Models/Team'
import Factory from '@ioc:Adonis/Lucid/Factory'

const TeamFactory = Factory.define(Team, ({ faker }) => {
  const teamName = `Team ${faker.address.country()} ${faker.random.word()}`.slice(0, 35)
  const teamAlias = faker.random.words().slice(0, 50)

  return {
    name: teamName,
    alias: (() => {
      const omit = faker.datatype.boolean()
      return omit ? null : teamAlias
    })(),
  }
}).build()

export default TeamFactory
