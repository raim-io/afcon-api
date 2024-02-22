import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('/health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

/**
 * group routes
 */

Route.resource('groups', 'GroupsController')
  .apiOnly()
  .middleware({
    update: ['findGroup'],
    show: ['findGroup'],
    destroy: ['findGroup'],
  })
