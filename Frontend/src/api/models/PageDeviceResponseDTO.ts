import type { DeviceResponseDTO } from './DeviceResponseDTO.ts'
import type { PageableObject } from './PageableObject.ts'
import type { SortObject } from './SortObject.ts'

export type PageDeviceResponseDTO = {
  /**
   * @type integer | undefined, int32
   */
  totalPages?: number
  /**
   * @type integer | undefined, int64
   */
  totalElements?: number
  /**
   * @type object | undefined
   */
  pageable?: PageableObject
  /**
   * @type integer | undefined, int32
   */
  size?: number
  /**
   * @type array | undefined
   */
  content?: DeviceResponseDTO[]
  /**
   * @type integer | undefined, int32
   */
  number?: number
  /**
   * @type object | undefined
   */
  sort?: SortObject
  /**
   * @type boolean | undefined
   */
  first?: boolean
  /**
   * @type boolean | undefined
   */
  last?: boolean
  /**
   * @type integer | undefined, int32
   */
  numberOfElements?: number
  /**
   * @type boolean | undefined
   */
  empty?: boolean
}