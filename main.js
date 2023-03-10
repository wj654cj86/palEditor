import cc from "./colorconvert.js";
let colors = [];
for (let i = 0; i < 16; i++) {
	let tr = text2html('<tr></tr>');
	colortbody.append(tr);
	colors[i] = [];
	for (let j = 0; j < 16; j++) {
		let td = text2html('<td><input type="color"></td>');
		tr.append(td);
		let color = td.querySelector('input');
		color.onchange = () => td.style.backgroundColor = color.value;
		Object.defineProperty(colors[i], j, {
			set: v => td.style.backgroundColor = color.value = v,
			get: () => color.value
		});
		colors[i][j] = '#ffffff';
	}
}

upload.onchange = async () => {
	try {
		let datalines = await loadfile('text', URL.createObjectURL(upload.files[0]))
			.then(str => str.replace(/\r\n/g, '\n').split('\n'))
			.then(arr => { arr.shift(), arr.shift(), arr.shift(); return arr; })
			.then(arr => arr.map(str => cc.rgb.hex(...str.split(' ').map(s => Number(s)))));
		let k = 0
		for (let i = 0; i < 16; i++) {
			for (let j = 0; j < 16; j++) {
				colors[i][j] = datalines[k++];
			}
		}
	} catch (e) {
		console.log(e);
	}
};
download.onclick = () => {
	let pal = 'JASC-PAL\r\n0100\r\n256\r\n';
	for (let i = 0; i < 16; i++) {
		for (let j = 0; j < 16; j++) {
			pal += cc.hex.rgb(colors[i][j]).join(' ') + '\r\n';
		}
	}
	startDownload(URL.createObjectURL(new Blob([pal], { type: 'text/plain' })), filename.value);
}