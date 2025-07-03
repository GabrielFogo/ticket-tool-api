const AuthController = () => import('#controllers/api/auth_controller')
const SectorsController = () => import('#controllers/api/sectors_controller')
const UsersController = () => import('#controllers/api/users_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const ResponsibleController = () => import('#controllers/api/tickets/responsibles_controller')
const TicketsController = () => import('#controllers/api/tickets_controller')
const ColumnsController = () => import('#controllers/api/columns_controller')

router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
router.post('/check-session', [AuthController, 'checkSession'])

router
  .group(() => {
    router.delete('/logout', [AuthController, 'logout'])
    router.get('/me', [AuthController, 'me'])

    router.get('/sectors', [SectorsController, 'getAll'])

    router.get('/users', [UsersController, 'getAllUsersByEnterpriseId'])
    router.get('/users/:id', [UsersController, 'show'])
    router.put('/users/:id/password', [UsersController, 'updatePassword'])

    router.get('/tickets/:id', [TicketsController, 'getByIdAndIsActive'])
    router.post('/tickets', [TicketsController, 'create'])
    router.patch('/tickets/update-ticket/:id', [TicketsController, 'updateTicket'])
    router.patch('/tickets/change-status/:id', [TicketsController, 'changeStatus'])

    router.get('/tickets/:id/getResponsible', [ResponsibleController, 'index'])
    router.put('/tickets/:id/responsible', [ResponsibleController, 'setResponsible'])
    router.patch('/ticket/getOutTicket/:id', [ResponsibleController, 'getOutResponsible'])

    router.post('/columns', [ColumnsController, 'create'])
    router.get('/columns', [ColumnsController, 'findAll'])
    router.put('/columns/reorganize', [ColumnsController, 'repositioningTicket'])
    router.put('/columns/reorganizeColumn', [ColumnsController, 'moveColumn'])
    router.delete('/columns/change-status/:id', [ColumnsController, 'changeStatus'])

    router
      .group(() => {
        router.post('/sectors', [SectorsController, 'create'])
        router.put('/sectors/:id', [SectorsController, 'update'])
        router.delete('/sectors/change-status/:id', [SectorsController, 'changeStatus'])

        router.post('/users', [UsersController, 'create'])
        router.patch('/users/change-status/:id', [UsersController, 'changeStatus'])
        router.put('/users/updateUser', [UsersController, 'update'])
      })
      .use(middleware.adminOnly())
    router
      .group(() => {
        router.patch('/tickets/:sectorId/move-sector', [TicketsController, 'moveToOtherSector'])
      })
      .use(middleware.adminSector())
  })
  .use(middleware.auth())
