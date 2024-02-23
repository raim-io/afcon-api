import Factory from '@ioc:Adonis/Lucid/Factory'
import Group from 'App/Models/Group'

const GroupFactory = Factory.define(Group, async ({ faker }) => {
  return {
    name: `Group ${faker.word.noun()}`,
  }
}).build()

export default GroupFactory
