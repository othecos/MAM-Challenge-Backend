import StorageController from '@controllers/storage'

describe('Mocha setup...',   () => {
 
  it('Initializing database...', async function () {
    const storageController = new StorageController()
    await storageController.isMongoInitialized()
    return true
  })
})