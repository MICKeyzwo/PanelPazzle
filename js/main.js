window.addEventListener("load", () => {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 900;
    canvas.height = 1200;
    canvas.style.width = 
        Math.min(400, document.documentElement.clientWidth * .9 | 0) + "px";
    canvas.style.height = 
        Math.min((400 * 4 / 3) | 0, document.documentElement.clientWidth * .9 * 4 / 3 | 0) + "px";
    window.addEventListener("resize", e => {
        canvas.style.width = 
            Math.min(400, document.documentElement.clientWidth * .9 | 0) + "px";
        canvas.style.height = 
            Math.min((400 * 4 / 3) | 0, document.documentElement.clientWidth * .9 * 4 / 3 | 0) + "px";
    });

    const srcs = {
        "test": "img/test.jpg",
        "f-4": "img/f-4_mssl.PNG"
    };
    var imgs = {};
    const ml = MediaLoader.create();
    ml.loadImage(srcs, res => {
        var arr = [];
        for(var i in imgs) arr.push(imgs[i]);
        imgs = arr;
        changeImage();
    }, imgs);

    const myImage = new Image();
    const file = document.getElementById("file");
    file.addEventListener("change", e => {
        const fr = new FileReader();
        fr.readAsDataURL(file.files[0]);
        fr.addEventListener("load", () => {
            myImage.src = fr.result;
            myImage.addEventListener("load", e => {
                setImage(myImage);
            });
        });
    });

    var imageId = NaN;
    const change = document.getElementById("changeImage");
    change.addEventListener("click", changeImage);

    function changeImage() {
        var nextId = 0;
        do {
            nextId = (Math.random() * imgs.length) | 0;
            if(imgs.length === 1) break;
        } while(imageId === nextId);
        imageId = nextId;
        setImage(imgs[imageId]);
    }

    function setImage(img) {
        ctx.clearRect(0, 0, 900, 900);
        if(img.width > img.height) {
            var size = img.height;
            var pad = (img.width - img.height) / 2;
            ctx.drawImage(img, pad, 0, size, size, 0, 0, 900, 900)
        } else {
            var size = img.width;
            var pad = (img.height - img.width) / 2;
            ctx.drawImage(img, 0, pad, size, size, 0, 0, 900, 900)
        }
        ctx.save();
        ctx.fill = "black";
        ctx.fillRect(300, 900, 600, 300);
        ctx.restore();
    }

    canvas.addEventListener("click", e => {
        const rect = e.target.getBoundingClientRect();
        const x = Math.round(400 * (e.clientX - rect.left) / canvas.clientWidth);
        const y = Math.round(400 * (e.clientY - rect.top) / canvas.clientHeight);
    });

});