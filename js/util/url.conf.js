import { Coder } from './Coder'

const tyBaseUrl = 'http://119.29.102.103:18888/',
      tyComUrl = '/user/post/,/';

export const _tyUrl = {
  obtain: () => tyBaseUrl + Coder.encode('typhoonspot/obtain' + tyComUrl),
  add: () => tyBaseUrl + Coder.encode('typhoonspot/add' + tyComUrl),
  remove: () => tyBaseUrl + Coder.encode('typhoonspot/remove' + tyComUrl),
  modify: () => tyBaseUrl + Coder.encode('typhoonspot/modify' + tyComUrl),
}