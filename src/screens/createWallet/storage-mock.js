/**
 * @format
 */
/* eslint-env jest */

const StorageMock = {
  get: jest.fn().mockResolvedValue('mockString'),
  set: jest.fn(),
}

export default StorageMock
