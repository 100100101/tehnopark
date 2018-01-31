/**
 * @Author: Sergey <iadmin>
 * @Date:   2017-09-22T11:32:57+03:00
 * @Filename: y.js
 * @Last modified by:   iadmin
 * @Last modified time: 2017-09-22T17:11:49+03:00
 */
module.exports = {
  /*возможные положения скролл панелей по оси Y*/
  validPositionsY: ['left', 'right'],
  /**/
  sliderYHeight: 0,
  /*конечная граница снизу*/
  lowerEnd: 0,
  /**/
  movementY: 0,
  /*состояние скроллирования перетаскиванием по оси Y*/
  draggingY: false,
  /*состояние скроллирования прокруткой по оси Y*/
  mousewheelY: false,
  /*состояние изменения размера по оси Y*/
  resizingY: false,
};
