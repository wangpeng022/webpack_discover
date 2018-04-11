/*路由控制的实现*/
function controller() {};

controller.prototype.management = function (req, res, next) {
   var _this = this;
   return (function () {
       return function (req, res, next) {
           res.render('management.html', { host: commonLibUrl });
       };
   })();
};

module.exports = new controller();
