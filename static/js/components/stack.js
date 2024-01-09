// TODO: move this file in a correct folder


class Stack {
  constructor() {
    this.items = [];
  }

  /**
   * Check if stack is empty
   *
   * @return {boolean}
   */
  isEmpty() {
    if (this.items.length > 0) {
      return false
    }

   return true
  }

  /**
   * Add a new element to stack
   *
   * @param {any} element
   */
  push(element) {
    this.items.push(element);
  }

  /**
   * Remove last element from stack
   *
   * @return {any}
   */
  pop() {
    this.items.pop()
  }

  /**
   * Return last element from stack (don't delete it)
   *
   * @return {any}
   */
  peek() {
    if (this.isEmpty()) {
      return null
    }

    return this.items[this.items.length - 1]
  }

  /**
   * Return stack's length
   *
   * @return {number}
   */
  length() {
    return this.items.length

  }

  /**
   * Reset stack
   */
  reset() {
    this.items = []
  }
}


export default Stack
