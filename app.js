const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playBtn = $('.btn-play');
const progress = $('#progress');
const heading = $('.header h2');
const cdthumb = $('.cd-thumb');
const audio = $('#audio');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist')
 

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs : [
    {
        name: 'Waiting for love',
        singer: 'Avicii',
        path: './assets/music/wtfl.mp3',
        img: './assets/img/song_1.jpeg'
    },
    {
        name: 'Bài nay chill phết',
        singer: 'Đen Vâu',
        path: './assets/music/bainaychill.mp3',
        img: './assets/img/bai_nay_chill.jpeg'
    },
    {
        name: 'Đường tôi chở em về',
        singer: 'Buitruonglinh',
        path: './assets/music/duongtoichoemve.mp3',
        img: './assets/img/duong_toi_cho.jpeg'
    },
    {
        name: 'Sài gòn hôm nay mưa',
        singer: 'JSOL & HOÀNG DUYÊN',
        path: './assets/music/saigonhomnaymua.mp3',
        img: './assets/img/sai_gon_hom_nay_mua.jpeg'
    },
    {
        name: 'Hãy trao cho anh',
        singer: 'SƠN TÙNG M-TP',
        path: './assets/music/song_4.mp3',
        img: './assets/img/song_4.jpeg'
    },
    ],
    
    render: function() {
        const htmls = this.songs.map( (song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}" >
            <div class="thumb" style="background-image: url('${song.img}')"></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    disfineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvent: function() {
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth;

        const cdthumbAnimate = cdthumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdthumbAnimate.pause()

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newcdWidth = cdWidth - scrollTop;

            cd.style.width = newcdWidth > 0 ? newcdWidth +'px' : 0 
            cd.style.opacity = newcdWidth/cdWidth
        }
        
        playBtn.onclick = function() {
            if(app.isPlaying) {
                app.isPlaying = false;
                audio.pause();
                playBtn.classList.remove('playing')
                cdthumbAnimate.pause()
            } else {
                app.isPlaying = true
                audio.play();
                playBtn.classList.add('playing')
                cdthumbAnimate.play()
            }

        }

        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100;
                progress.value = progressPercent;
            }
        }

        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime =seekTime
        }

        nextBtn.onclick = function() {
            app.nextSong()
            audio.play()
            app.render()
        }

        prevBtn.onclick = function() {
            app.prevSong()
            audio.play()
            app.render()
        }

        randomBtn.onclick = function(e) {
            if(app.isRandom) {
                app.isRandom = false
                e.target.classList.remove('active')
            } else {
                e.target.classList.add('active')
                app.isRandom = true;
            }
        }

        repeatBtn.onclick =function(e) {
            if(app.isRepeat) {
                app.isRepeat = false
                e.target.classList.remove('active')
            } else {
                e.target.classList.add('active')
                app.isRepeat = true;
            }
        }

        audio.onended = function() {
            if(app.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')

            if(songNode || e.target.closest('option')) {
                if(songNode) {
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }
            }
        }
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdthumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex <0 ) {
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurrentSong()
    },

    start: function() {
        this.disfineProperties()
        this.handleEvent()
        this.render()
        this.loadCurrentSong()

        
    }
}

app.start()