window.addEventListener("load", () => {

    const { getEl, el } = EL;

    const canvas = getEl("#canvas");
    const ctx = canvas.getContext("2d");
    const nowImage = el("canvas");
    const nowCtx = nowImage.getContext("2d");
    canvas.width = nowImage.width = nowImage.height = 900;
    canvas.height = 1200;
    canvas.style.width =
        Math.min(400, document.documentElement.clientWidth * .95 | 0) + "px";
    canvas.style.height =
        Math.min((400 * 4 / 3) | 0, document.documentElement.clientWidth * .9 * 4 / 3 | 0) + "px";
    window.addEventListener("resize", e => {
        canvas.style.width =
            Math.min(400, document.documentElement.clientWidth * .95 | 0) + "px";
        canvas.style.height =
            Math.min((400 * 4 / 3) | 0, document.documentElement.clientWidth * .9 * 4 / 3 | 0) + "px";
    });

    function Panel(id, x, y, nul) {
        this.id = id;
        this.ix = this.id % 3;
        this.iy = (this.id / 3) | 0;
        this.x = x;
        this.y = y;
        this.nul = nul;
    }
    Panel.prototype.draw = function () {
        if (!this.nul) {
            ctx.save();
            ctx.drawImage(nowImage, 300 * this.ix, 300 * this.iy, 300, 300, this.x * 300, this.y * 300, 300, 300);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.strokeRect(this.ix * 300 + 1, this.iy * 300 + 1, 299, 299);
            ctx.restore();
        }
    }

    const srcs = {
        "title": "img/title.png",
        "test": "img/test.jpg",
        "f-4": "img/f-4_mssl.PNG"
    };
    var imgs;
    var titleImage;
    const ml = MediaLoader.create();
    ml.loadImage(srcs, res => {
        titleImage = res.title;
        delete res.title;
        var arr = [];
        for (var i in res) arr.push(res[i]);
        imgs = arr;
        ctx.save();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.drawImage(titleImage, 300, 900);
        ctx.strokeRect(300, 900, 600, 300);
        ctx.restore();
        changeImage();
    }, imgs);

    const myImage = new Image();
    const file = getEl("#file");
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
    const change = getEl("#changeImage");
    change.addEventListener("click", changeImage);

    function changeImage() {
        var nextId = 0;
        do {
            nextId = (Math.random() * imgs.length) | 0;
            if (imgs.length === 1) break;
        } while (imageId === nextId);
        imageId = nextId;
        setImage(imgs[imageId]);
    }

    function setImage(img) {
        ctx.clearRect(0, 0, 900, 900);
        nowCtx.clearRect(0, 0, 900, 900);
        if (img.width > img.height) {
            var size = img.height;
            var pad = (img.width - img.height) / 2;
            nowCtx.drawImage(img, pad, 0, size, size, 0, 0, 900, 900)
        } else {
            var size = img.width;
            var pad = (img.height - img.width) / 2;
            nowCtx.drawImage(img, 0, pad, size, size, 0, 0, 900, 900)
        }
        setUp();
    }

    var panels;

    function setUp() {
        var arr =
            new Array(9)
                .fill(0)
                .map((a, i) => i)
                .sort(() => Math.random() - 0.5);
        if(arr[6] != 6) {
            var i = arr.indexOf(6);
            [arr[6], arr[i]] = [arr[i], arr[6]];
        }
        panels = [0, 0, 0, 0].map(() => []);
        panels.forEach((ar, y) => {
            if (y < 3)
                for (var i = 0; i < 3; i += 1)
                    ar.push(new Panel(arr[y * 3 + i], i, y, false));
            else
                ar.push(new Panel(9, 0, 3, true));
        });
        drawPanels();
    }

    function drawPanels() {
        ctx.clearRect(0, 0, 900, 900);
        ctx.clearRect(0, 900, 300, 300);
        panels.forEach(arr =>
            arr.forEach(item => item.draw())
        );
    }

    getEl("#reset").addEventListener("click", setUp);

    canvas.addEventListener("click", e => {
        const rect = e.target.getBoundingClientRect();
        var x = Math.round(900 * (e.clientX - rect.left) / canvas.clientWidth);
        var y = Math.round(1200 * (e.clientY - rect.top) / canvas.clientHeight);
        x = (x / 300) | 0;
        y = (y / 300) | 0;
        if (y >= 3 && x > 0) return;
        if (panels[y][x].nul) return;
        var canMove = false;
        var nul = [];

        dif: for (var i = -1; i < 2; i += 1) {
            for (var j = -1; j < 2; j += 1) {
                if (i == 0 && j == 0 || i != 0 && j != 0) continue;
                if (panels[y + i] && panels[y + i][x + j]) {
                    if (panels[y + i][x + j].nul) {
                        canMove = true;
                        nul[0] = x + j;
                        nul[1] = y + i;
                        break dif;
                    }
                }
            }
        }
        if (canMove) {
            panels[y][x].x = nul[0];
            panels[y][x].y = nul[1];
            panels[nul[1]][nul[0]].x = x;
            panels[nul[1]][nul[0]].y = y;
            [panels[y][x], panels[nul[1]][nul[0]]] = [panels[nul[1]][nul[0]], panels[y][x]];
        }
        drawPanels();
    });

});