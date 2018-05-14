const litecoin = require('litecoin');

function callRpc(cmd, args, rpc) {
	const fn = args[args.length-1];

	if (typeof fn === 'function') {
		args.pop();
		rpc.call(cmd, args, function() {
			const args = [].slice.call(arguments);
			args.unshift(null);
			fn.apply(this, args);
		}, fn);
	} else {
		return new Promise((resolve, reject) => {
			rpc.call(cmd, args, function(){
				const args = [].slice.call(arguments);
				args.unshift(null);
				resolve(args[1]);
			}, reject);
		});
	}
}


(function() {
  Object.getOwnPropertyNames(litecoin.Client.prototype)
    .filter((p) => typeof litecoin.Client.prototype[p] === 'function' && p !== "cmd" && p!= "constructor")
    .forEach(method =>
	    (function(protoFn) {
	    	litecoin.Client.prototype[protoFn] = function() {
	        const args = [].slice.call(arguments);
	        return callRpc(protoFn.toLowerCase(), args, this.rpc);
	      };
	    })(method)
    );
})();

module.exports = litecoin.Client;
