export type Pageable = {
  /**
   * @minLength 0
   * @type integer | undefined, int32
   */
  page?: number
  /**
   * @minLength 1
   * @type integer | undefined, int32
   */
  size?: number
  /**
   * @type array | undefined
   */
  sort?: string[]
}