/*
Video Player - Code by Zsolt Király
v1.0.1 - 2018-06-14
*/

'use strict';
var youtubeVideoPlayer= function() {

	function signatura() {
		if (window['console']) {
			const text = {
				black: '%c     ',
				blue: '%c   ',
				author: '%c  Zsolt Király  ',
				github: '%c  https://zsoltkiraly.com/'
			}

			const style = {
				black: 'background: #282c34',
				blue: 'background: #61dafb',
				author: 'background: black; color: white',
				github: ''
			}

			console.log(text.black + text.blue + text.author + text.github, style.black, style.blue, style.author, style.github);
		}
	}

	signatura();

	function app() {

		var getJSON = function(url, callback) {

			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.responseType = 'json';
	
			xhr.onload = function() {
				var status = xhr.status;
	
				if (status === 200) {
					callback(null, xhr.response);
				} else {
					callback(status, xhr.response);
				}
			};
			xhr.send();
		}
	
		function getWidth() {
			return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		}
	
		function convertTime(duration) {
			var a = duration.match(/\d+/g);
	
			if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
				a = [0, a[0], 0];
			}
	
			if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
				a = [a[0], 0, a[1]];
			}
			
			if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
				a = [a[0], 0, 0];
			}
	
			duration = 0;
	
			if (a.length == 3) {

				duration = duration + parseInt(a[0]) * 3600;
				duration = duration + parseInt(a[1]) * 60;
				duration = duration + parseInt(a[2]);
			}
	
			if (a.length == 2) {

				duration = duration + parseInt(a[0]) * 60;
				duration = duration + parseInt(a[1]);
			}
	
			if (a.length == 1) {

				duration = duration + parseInt(a[0]);
			}
			return duration
		}
	
	
		function secondsToHms(duration) {

			let h = Math.floor(duration / 3600),
				m = Math.floor(duration % 3600 / 60),
				s = Math.floor(duration % 3600 % 60);
	
			let hDisplay = h > 0 ? h + (h == 1 ? ':' : ':') : '',
				mDisplay = m > 0 ? m + (m == 1 ? ':' : s > 0 ? ':' : '') : '',
				sDisplay = s > 0 ? s + (s == 1 ? '' : '') : '';
	
			return hDisplay + mDisplay + sDisplay; 
		}
	
	
		function error(tP) {

			tP.querySelector('.video-wrapper').classList.add('error-video');
			tP.querySelector('.video-wrapper .play-and-info-contet .content').innerHTML = 'A videó nem érhető el';
		}


		var youtubeDOM = function() {
			
			function app() {

				var youtubePlayers = document.querySelectorAll('iframe[src*="//www.youtube.com"]:not(.teka-iframe)');

				youtubePlayers.forEach((youtube) => {

					var youtubeDOM = document.createElement('SECTION');

					youtubeDOM.setAttribute('class', 'youtube-video-player loading show');

					youtubeDOM.innerHTML = 
					'<div class="video-wrapper">' + 
						'<div class="video-content">' + 
							'<div class="background-img"></div>' +
							'<div class="black"></div>' +
							'<div class="iframe">' + 
								'<iframe class="teka-iframe" width="' + youtube.getAttribute('width') +'" height="' + youtube.getAttribute('height') +'" src="' + youtube.getAttribute('src') +'"  frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>' +
							'</div>' +
						'</div>' + 
						'<div class="play-and-info-contet"> ' + 
							'<div class="content"> ' + 
								'<div class="play">' + 
									'<i class="icon"></i>' + 
								'</div>' + 
								'<div class="text-content">' + 
									'<div class="video">Videó</div>' + 
									'<div class="title"></div>' +
									'<div class="duration"></div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>'

					youtube.parentNode.insertBefore(youtubeDOM, youtube.nextSibling);
					youtube.parentElement.removeChild(youtube);
				});

				var youtubePlayers = document.querySelectorAll('.youtube-video-player');

				youtubePlayers.forEach((youtubePlayer) => {

					var youtubeEmbedCharacterLength = 11,
						youtubeSrc = youtubePlayer.querySelector('.video-wrapper .video-content .iframe iframe').getAttribute('src');
						
					if(youtubeSrc) {

						var id = youtubeSrc.slice(youtubeSrc.length - youtubeEmbedCharacterLength, youtubeSrc.length);
						
						if(id) {
							var urlTitle = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + id + '&key=AIzaSyDRIcdO49yFFr-vDpRXDa3TvnLA_ansu8s',
								urlDuration = 'https://www.googleapis.com/youtube/v3/videos?id=' + id + '&part=contentDetails&key=AIzaSyDRIcdO49yFFr-vDpRXDa3TvnLA_ansu8s';
						}
					}

					getJSON(urlTitle,
					function(err, youtubeJSON) {

						if(youtubeJSON.pageInfo.totalResults > 0) {

							if (err == null) {

								var title = youtubeJSON.items[0].snippet.title;

								if(title) {

									youtubePlayer.querySelector('.video-wrapper .play-and-info-contet .text-content .title').innerHTML = title;
								}

								var res = '';
								var thumb = youtubeJSON.items[0].snippet.thumbnails;

								if(thumb) {
									if(thumb.maxres) {
										res = thumb.maxres.url;

									} else if(thumb.standard) {

										res = thumb.standard.url;

									} else if (thumb.high) {

										res = thumb.high.url;

									} else if (thumb.medium) {

										res = thumb.medium.url;

									} else if (thumb.default) {

										res = thumb.default.url;
									}
								}
								youtubePlayer.querySelector('.video-content .background-img').style.backgroundImage = 'url(' + res + ')';
							}
						} else {

							error(youtubePlayer);
						}
					});

					getJSON(urlDuration,
					function(err, youtubeJSON) {

						if(youtubeJSON.pageInfo.totalResults > 0) {

							if (err == null) {

								var duration = secondsToHms(Number(convertTime(youtubeJSON.items[0].contentDetails.duration)));

								if(duration) {

									youtubePlayer.querySelector('.video-wrapper .play-and-info-contet .text-content .duration').innerHTML = duration;
								}
							}
						} else {

							error(youtubePlayer);
						}
					});
					youtubePlayer.querySelector('.video-wrapper').setAttribute('video-id', id);
				});
			}

			return {
				app: app
			}

		}();

		var responsiveIframeVideo = function() {

			function setAspectratio(v) {

				var video = v.querySelector('iframe[src*="//www.youtube.com"].teka-iframe');

				if(video) {

					video.setAttribute('data-aspectratio', '0.5625');
				}
			}

			function youtube(v) {

				var video = v.querySelector('iframe[src*="//www.youtube.com"].teka-iframe');

				if(video) {

					var newWidth = video.closest('.video-wrapper').offsetWidth;

					if(newWidth) {

						video.setAttribute('width', newWidth);
						video.setAttribute('height', newWidth * parseFloat(video.getAttribute('data-aspectratio')));
					}
				}
			}

			function app() {

				var youtubePlayers = document.querySelectorAll('.youtube-video-player');

				youtubePlayers.forEach((youtubePlayer) => {
					var cachedWidth = getWidth();

					setAspectratio(youtubePlayer);
					youtube(youtubePlayer);

					window.addEventListener('resize', function() {

						var newWidth = getWidth();

						if(newWidth !== cachedWidth) {

							youtube(youtubePlayer);
						}
					}, false);
				});
			}

			return {
				app: app
			}
		}();

		var play = function() {

			function startVideo(tP) {
				var playAndInfoContet = tP.querySelector('.play-and-info-contet');

				if(playAndInfoContet) {
					playAndInfoContet.addEventListener('click', function() {

						var objWrapper = this.closest('.video-wrapper');

						if(objWrapper) {

							var backgroundImage = objWrapper.querySelector('.background-img'),
								black = objWrapper.querySelector('.black'),
								iframe = objWrapper.querySelector('.iframe iframe'),
								playAndInfoContet = objWrapper.querySelector('.play-and-info-contet');
						}

						if(backgroundImage && objWrapper && iframe && black) {

							backgroundImage.classList.add('disabled-teka-video');
							playAndInfoContet.classList.add('disabled-teka-video');
							objWrapper.classList.add('disabled-teka-video');

							iframe.classList.add('active-teka-video');
							iframe.setAttribute('src', 'https://www.youtube.com/embed/' + objWrapper.getAttribute('video-id') + '?autoplay=1');

							setTimeout(() => {

								black.classList.add('disabled-teka-video');
							}, 700)

							setTimeout(() => {

								backgroundImage.classList.add('hide-teka-video');
								playAndInfoContet.classList.add('hide-teka-video');
								black.classList.add('hide-teka-video');
								objWrapper.classList.add('hide-teka-video');

								backgroundImage.classList.remove('disabled-teka-video');
								playAndInfoContet.classList.remove('disabled-teka-video');
								black.classList.remove('disabled-teka-video');
								objWrapper.classList.remove('disabled-teka-video');
							}, 1000)
						}
					}, false);
				}
			}


			function app() {

				var youtubePlayers = document.querySelectorAll('.youtube-video-player');

				youtubePlayers.forEach((youtubePlayer) => {
					startVideo(youtubePlayer);
				});
			}

			return {
				app: app
			}
		}();


		function loading() {
			var youtubePlayers = document.querySelectorAll('.youtube-video-player');

			youtubePlayers.forEach((youtubePlayer) => {

				setTimeout(() => {

					youtubePlayer.classList.remove('show');

					setTimeout(() => {

						youtubePlayer.classList.remove('loading');
					}, 1000);
				}, 1000);
			});
		}


		youtubeDOM.app();
		responsiveIframeVideo.app();
		play.app();
		loading();
	}

	return {
		app: app
	}

}();

window.addEventListener('load', function(event) {
	youtubeVideoPlayer.app();
}, false);