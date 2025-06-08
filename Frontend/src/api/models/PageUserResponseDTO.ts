import type { PageableObject } from './PageableObject.ts'
import type { SortObject } from './SortObject.ts'
import type { UserResponseDTO } from './UserResponseDTO.ts'

export type PageUserResponseDTO = {
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
  content?: UserResponseDTO[]
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