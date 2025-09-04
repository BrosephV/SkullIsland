const { useState, useEffect, useRef } = React;
const STOP_WORDS = new Set(["the","is","at","which","on","and","a","an","in","to","of","for","with","that","it","as","this","by","from","or","are","was","but","be","has","have","not","they","you","i","we","he","she","his","her","them","their","my","your","so","if","out","up","what","when","where","how","all","do","does","did","about","just","like","now","me","more","no","than","then","got","its","get","been","him","also","some","any","one","two","new","would","could","should","make","made","say","said","didn","don"]);

function RedditWordMap() {
  const headerHeight = 48;
  const [posts, setPosts] = useState([]);
  const [wordData, setWordData] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subreddit, setSubreddit] = useState('all');
  const [inputValue, setInputValue] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isResizing, setIsResizing] = useState({ vertical: false, horizontal: false, left: false, top: false });
  const [panelHeightPx, setPanelHeightPx] = useState(Math.round(window.innerHeight * (2/3)));
  const [panelWidthPx, setPanelWidthPx] = useState(Math.round(window.innerWidth * 0.75));
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: headerHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [gradientPair, setGradientPair] = useState('fuchsia-cyan');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isColorsOpen, setIsColorsOpen] = useState(false);
  const [customGradient, setCustomGradient] = useState(null);
  const [postSort, setPostSort] = useState('score-desc');
  const svgRef = useRef();
  const mediaRef = useRef();
  const postsContainerRef = useRef();
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0, panelX: 0, panelY: 0 });
  const panelWidthRef = useRef(panelWidthPx);
  const panelHeightRef = useRef(panelHeightPx);
  const panelPositionRef = useRef(panelPosition);
  useEffect(() => { panelWidthRef.current = panelWidthPx; }, [panelWidthPx]);
  useEffect(() => { panelHeightRef.current = panelHeightPx; }, [panelHeightPx]);
  useEffect(() => { panelPositionRef.current = panelPosition; }, [panelPosition]);
  const gradientPairs = {
    'fuchsia-cyan': { color1: 'rgba(200, 0, 200, 1)', color2: 'rgba(0, 180, 180, 1)' },
    'blue-orange': { color1: 'rgba(0, 102, 204, 1)', color2: 'rgba(255, 153, 0, 1)' },
    'green-yellow': { color1: 'rgba(0, 153, 0, 1)', color2: 'rgba(255, 255, 0, 1)' },
    'purple-red': { color1: 'rgba(102, 0, 204, 1)', color2: 'rgba(204, 0, 0, 1)' },
    'custom': {
      color1: customGradient?.color1 || 'rgba(200, 0, 200, 1)',
      color2: customGradient?.color2 || 'rgba(0, 180, 180, 1)'
    }
  };

  function getTextDimensions(text, fontSize) {
    const canvas = getTextDimensions.canvas || (getTextDimensions.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = `${fontSize}px monospace`;
    const metrics = context.measureText(text);
    const width = metrics.width;
    const height = metrics.fontBoundingBoxAscent ? (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent) : fontSize * 1.2;
    return { width, height };
  }

  const fetchPosts = (targetSubreddit) => {
    setLoading(true);
    setSubreddit(targetSubreddit);
    setSelectedWord(null);
    setSelectedMedia(null);
    setPanelPosition({ x: 0, y: headerHeight });
    setPanelWidthPx(Math.round(window.innerWidth * 0.75));
    setPanelHeightPx(Math.round(window.innerHeight * (2/3)));
    const cleanSubreddit = (targetSubreddit || 'all').trim().toLowerCase();

    if (!/^[a-z0-9_-]+$/i.test(cleanSubreddit) || cleanSubreddit.includes('$')) {
      alert('Invalid subreddit name. Please use only letters, numbers, underscores, and hyphens.');
      setSubreddit('all');
      setLoading(false);
      return;
    }

      const proxy = 'https://cors-anywhere.herokuapp.com/';
    const redditUrl = `https://www.reddit.com/r/${cleanSubreddit}.json?limit=100`;
const url = `https://corsproxy.io/?${encodeURIComponent(`https://www.reddit.com/r/${cleanSubreddit}.json?limit=100`)}`;

    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setPosts(data.data.children.map(c => c.data));
        setLoading(false);
      })
      .catch(e => {
        alert(`Error fetching subreddit: ${e.message}`);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (subreddit) {
      fetchPosts(subreddit);
    }
  }, [subreddit]);

  useEffect(() => {
    if (!posts.length) {
      return;
    }
    const wordMap = new Map();
    posts.forEach(post => {
      const words = (post.title.toLowerCase().match(/\b[a-z]{2,}\b/g) || []).filter(w => !STOP_WORDS.has(w));
      new Set(words).forEach(word => {
        if (!wordMap.has(word)) wordMap.set(word, { word, count: 0, posts: [] });
        const entry = wordMap.get(word);
        entry.count++;
        entry.posts.push(post);
      });
    });

    let wordArray = Array.from(wordMap.values()).sort((a,b)=>b.count - a.count);

    const minFont = 10, maxFont = 36;
    const minRadius = 18, maxRadius = 100;
    const counts = wordArray.map(d=>d.count), maxCount = Math.max(...counts), minCount = Math.min(...counts);

    wordArray.forEach(d => {
      d.fontSize = minFont + (maxFont - minFont) * (d.count - minCount) / (maxCount - minCount || 1);
      d.bubbleRadius = minRadius + (maxRadius - minRadius) * (d.count - minCount) / (maxCount - minCount || 1);
      const { width, height } = getTextDimensions(d.word, d.fontSize);
      d.textWidth = width;
      d.textHeight = height;
    });
    setWordData(wordArray);
  }, [posts, gradientPair]);

  useEffect(() => {
    if (!wordData.length || loading) {
      return;
    }

    const width = svgRef.current ? svgRef.current.clientWidth : window.innerWidth;
    const height = svgRef.current ? svgRef.current.clientHeight : (window.innerHeight - headerHeight);
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const centerX = width / 2, centerY = height / 2;

    const sorted = [...wordData].sort((a, b) => b.count - a.count);
    sorted[0].x = centerX; sorted[0].y = centerY;

    const minRadiusSpawn = 80;
    const maxRadiusSpawn = Math.max(160, Math.min(width, height) * 0.35);
    const maxCountVal = sorted[0].count;
    const minCountVal = sorted[sorted.length - 1].count;

    sorted.slice(1).forEach(d => {
      const angle = Math.random() * 2 * Math.PI;
      const t = (maxCountVal - d.count) / (maxCountVal - minCountVal || 1);
      const spawnRadius = minRadiusSpawn + t * (maxRadiusSpawn - minRadiusSpawn) + Math.random() * 30;
      d.x = centerX + Math.cos(angle) * spawnRadius;
      d.y = centerY + Math.sin(angle) * spawnRadius;
    });

    const node = svg.append("g").selectAll("g").data(sorted).join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer");

    node.append("defs").append("linearGradient")
      .attr("id", d => `grad-${d.word}`)
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%")
      .selectAll("stop")
      .data(d => {
        const { color1, color2 } = gradientPairs[gradientPair];
        const t = (d.count - minCountVal) / (maxCountVal - minCountVal || 1);
        const stop1Color = d3.interpolateRgb(color1, color2)(1 - t);
        const stop2Color = d3.interpolateRgb(color1, color2)(t);
        return [
          { offset: "15%", color: stop1Color },
          { offset: "100%", color: stop2Color }
        ];
      })
      .enter().append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    node.append("circle")
      .attr("r", d => d.bubbleRadius)
      .attr("fill", d => `url(#grad-${d.word})`)
      .attr("opacity", .85);

    node.append("text").text(d => d.word)
      .attr("font-size", d => d.fontSize)
      .attr("fill", "#ddd")
      .attr("text-anchor", "middle").attr("dominant-baseline", "central").style("pointer-events", "none");

    const simulation = d3.forceSimulation(sorted)
      .force("center", d3.forceCenter(centerX, centerY).strength(0.05))
      .force("popularAttract", d3.forceManyBody().strength(d => d === sorted[0] ? 50 : 0))
      .force("bubbleAttract", d3.forceManyBody().strength(d => d.bubbleRadius * 0.02))
      .force("collision", d3.forceCollide().radius(d => d.bubbleRadius).strength(0.9))
      .on("tick", () => {
        sorted.forEach(d => {
          d.x = Math.max(d.bubbleRadius, Math.min(width - d.bubbleRadius, d.x));
          d.y = Math.max(d.bubbleRadius, Math.min(height - d.bubbleRadius, d.y));
        });
        node.attr("transform", d => `translate(${d.x},${d.y})`);
      });

    node.on("mouseenter", (event, d) => {
      const newR = d.bubbleRadius + 20;
      d3.select(event.currentTarget).select("circle").transition().duration(300).attr("r", newR);
      d3.select(event.currentTarget).select("text").transition().duration(300).attr("font-size", d.fontSize + 9).attr("fill", "#000").attr("font-weight", "bold");
      simulation.force("collision", d3.forceCollide().radius(d2 => d2 === d ? newR : d2.bubbleRadius).strength(0.9));
      simulation.alpha(0.3).restart();
    }).on("mouseleave", (event, d) => {
      d3.select(event.currentTarget).select("circle").transition().duration(300).attr("r", d.bubbleRadius);
      d3.select(event.currentTarget).select("text").transition().duration(300).attr("font-size", d.fontSize).attr("fill", "#ddd").attr("font-weight", "normal");
      simulation.force("collision", d3.forceCollide().radius(d2 => d2.bubbleRadius).strength(0.9));
      simulation.alpha(0.3).restart();
    }).on("click", (event, d) => {
      setSelectedWord(d);
      setSelectedMedia(null);
    });

    return () => {
      simulation.stop();
    };
  }, [wordData, loading, gradientPair]);

  useEffect(() => {
    if (!selectedMedia || !mediaRef.current || (selectedMedia.type !== 'image' && selectedMedia.type !== 'album' && selectedMedia.type !== 'image-text')) {
      return;
    }
    const img = d3.select(mediaRef.current);
    let scale = selectedMedia.scale || 1;

    const handleWheel = (event) => {
      event.preventDefault();
      const delta = event.deltaY * -0.002;
      scale = Math.max(0.2, Math.min(3, scale + delta));
      img.node().style.transform = `scale(${scale})`;
      setSelectedMedia(prev => ({ ...prev, scale }));
    };

    img.on("wheel", handleWheel);

    return () => {
      img.on("wheel", null);
    };
  }, [selectedMedia]);

  useEffect(() => {
    let player = null;
    if (selectedMedia?.type === 'video' && selectedMedia.dashUrl && mediaRef.current) {
      player = dashjs.MediaPlayer().create();
      player.initialize(mediaRef.current, selectedMedia.dashUrl, true);
      player.setAutoPlay(true);
      player.on(dashjs.MediaPlayer.events.ERROR, (e) => {
        console.error('DASH player error:', e.error);
        if (selectedMedia.videoUrl) {
          setSelectedMedia(prev => ({
            ...prev,
            dashUrl: null,
            hasAudio: !!prev.audioUrl
          }));
        } else {
          setSelectedMedia(null);
        }
      });
    }

    return () => {
      if (player) {
        player.reset();
      }
    };
  }, [selectedMedia]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isDragging && postsContainerRef.current) {
        const newX = event.clientX - dragOffsetRef.current.x;
        const newY = event.clientY - dragOffsetRef.current.y;
        const minX = 0;
        const maxX = Math.max(0, window.innerWidth - panelWidthRef.current - 8);
        const minY = headerHeight;
        const currentHeight = selectedMedia?.panelHeightPx || panelHeightRef.current;
        const maxY = Math.max(minY, window.innerHeight - currentHeight - 8);
        setPanelPosition({
          x: Math.max(minX, Math.min(maxX, newX)),
          y: Math.max(minY, Math.min(maxY, newY))
        });
      } else if (isResizing.vertical && postsContainerRef.current) {
        const deltaY = event.clientY - resizeStartRef.current.y;
        let newHeightPx = resizeStartRef.current.height + deltaY;
        const minHeightPx = 100;
        const maxHeightPx = window.innerHeight - panelPosition.y - 8;
        newHeightPx = Math.max(minHeightPx, Math.min(maxHeightPx, newHeightPx));
        if (selectedMedia) {
          setSelectedMedia(prev => ({ ...prev, panelHeightPx: newHeightPx }));
        } else {
          setPanelHeightPx(newHeightPx);
        }
      } else if (isResizing.top && postsContainerRef.current) {
        const deltaY = resizeStartRef.current.y - event.clientY;
        let newHeightPx = resizeStartRef.current.height + deltaY;
        const minHeightPx = 100;
        const maxHeightPx = window.innerHeight - headerHeight - 8;
        newHeightPx = Math.max(minHeightPx, Math.min(maxHeightPx, newHeightPx));
        const newY = resizeStartRef.current.panelY - (newHeightPx - resizeStartRef.current.height);
        if (selectedMedia) {
          setSelectedMedia(prev => ({ ...prev, panelHeightPx: newHeightPx }));
        } else {
          setPanelHeightPx(newHeightPx);
        }
        setPanelPosition(prev => ({
          ...prev,
          y: Math.max(headerHeight, Math.min(window.innerHeight - newHeightPx - 8, newY))
        }));
      } else if (isResizing.horizontal && postsContainerRef.current) {
        const deltaX = event.clientX - resizeStartRef.current.x;
        let newWidthPx = resizeStartRef.current.width + deltaX;
        const minWidthPx = 300;
        const maxWidthPx = window.innerWidth - panelPosition.x - 8;
        newWidthPx = Math.max(minWidthPx, Math.min(maxWidthPx, newWidthPx));
        setPanelWidthPx(newWidthPx);
      } else if (isResizing.left && postsContainerRef.current) {
        const deltaX = resizeStartRef.current.x - event.clientX;
        let newWidthPx = resizeStartRef.current.width + deltaX;
        const minWidthPx = 300;
        const maxWidthPx = window.innerWidth - 48 - 8;
        newWidthPx = Math.max(minWidthPx, Math.min(maxWidthPx, newWidthPx));
        const newX = resizeStartRef.current.panelX - (newWidthPx - resizeStartRef.current.width);
        setPanelWidthPx(newWidthPx);
        setPanelPosition(prev => ({
          ...prev,
          x: Math.max(0, Math.min(window.innerWidth - newWidthPx - 8, newX))
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing({ vertical: false, horizontal: false, left: false, top: false });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    if (isDragging || isResizing.vertical || isResizing.horizontal || isResizing.left || isResizing.top) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, selectedMedia]);

  const handleDragStart = (event) => {
    if (postsContainerRef.current) {
      setIsDragging(true);
      dragOffsetRef.current = {
        x: event.clientX - panelPosition.x,
        y: event.clientY - panelPosition.y
      };
    }
  };

  const handleResizeStart = (event, direction) => {
    event.preventDefault();
    if (postsContainerRef.current) {
      setIsResizing({
        vertical: direction === 'vertical',
        horizontal: direction === 'horizontal',
        left: direction === 'left',
        top: direction === 'top'
      });
      resizeStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        width: panelWidthRef.current,
        height: selectedMedia?.panelHeightPx || panelHeightRef.current,
        panelX: panelPosition.x,
        panelY: panelPosition.y
      };
    }
  };

  const handleMouseDownMedia = (event) => {
    event.preventDefault();
    if (postsContainerRef.current) {
      setIsResizing({ vertical: true, horizontal: false, left: false, top: false });
      resizeStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        width: panelWidthRef.current,
        height: selectedMedia?.panelHeightPx || panelHeightRef.current,
        panelX: panelPosition.x,
        panelY: panelPosition.y
      };
    }
  };

  const handleResize = (direction) => {
    const stepPx = (window.innerHeight - headerHeight) * 0.05;
    const minHeightPx = 100;
    const maxHeightPx = window.innerHeight - panelPosition.y - 8;
    const currentHeight = selectedMedia?.panelHeightPx || panelHeightRef.current;
    const newHeightPx = direction === 'increase'
      ? Math.min(maxHeightPx, currentHeight + stepPx)
      : Math.max(minHeightPx, currentHeight - stepPx);
    if (selectedMedia) {
      setSelectedMedia(prev => ({ ...prev, panelHeightPx: newHeightPx }));
    } else {
      setPanelHeightPx(newHeightPx);
    }
  };

  const toggleSettingsMenu = () => {
    setIsSettingsOpen(prev => !prev);
    setIsColorsOpen(false);
  };

  const openColorsSubmenu = () => {
    setIsColorsOpen(true);
  };

  const handleGradientSelect = (pair) => {
    setGradientPair(pair);
    setIsColorsOpen(false);
    setIsSettingsOpen(false);
  };

  const handleColorChange = (colorKey, value) => {
    setCustomGradient(prev => ({
      ...prev,
      [colorKey]: value
    }));
    setGradientPair('custom');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    const subredditName = inputValue.trim().replace(/^r\//i, '').replace(/^\/r\//i, '').toLowerCase();
    const finalSubreddit = subredditName === '' ? 'all' : subredditName;
    setSubreddit(finalSubreddit);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const hasValidImage = (post) => {
    const possibleUrls = [
      post.preview?.images?.[0]?.source?.url,
      post.url,
      post.thumbnail,
      post.media?.oembed?.thumbnail_url
    ].filter(url =>
      url &&
      /\.(jpg|jpeg|png|gif)$/i.test(url) &&
      !url.includes('redditmedia.com/videos/') &&
      !url.includes('reddit.com') &&
      url.match(/^https?:\/\//) &&
      !['default', 'self', 'nsfw', 'spoiler'].includes(url)
    );
    return possibleUrls.length > 0;
  };

  const getYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getVideoUrl = (post) => {
    if (post.url && (post.url.includes('youtube.com') || post.url.includes('youtu.be'))) {
      const videoId = getYouTubeVideoId(post.url);
      if (videoId) {
        return { type: 'youtube', videoId, hasAudio: true };
      }
    }
    if (post.is_video && post.media?.reddit_video) {
      const dashUrl = post.media.reddit_video.dash_url;
      const videoUrl = post.media.reddit_video.fallback_url;
      const audioUrl = post.media.reddit_video.hls_url?.replace('DASHPlaylist.mpd', 'HLS_AUDIO_160_K.mp4');
      if (dashUrl) {
        return { type: 'reddit', dashUrl, hasAudio: true };
      }
      return { type: 'reddit', videoUrl, audioUrl, hasAudio: !!audioUrl };
    }
    if (post.url.endsWith('.mp4')) {
      return { type: 'reddit', videoUrl: post.url, audioUrl: null, hasAudio: false };
    }
    return null;
  };

  const handleImageClick = (post) => {
    const possibleUrls = [
      post.preview?.images?.[0]?.source?.url,
      post.url,
      post.thumbnail,
      post.media?.oembed?.thumbnail_url
    ].filter(url =>
      url &&
      /\.(jpg|jpeg|png|gif)$/i.test(url) &&
      !url.includes('redditmedia.com/videos/') &&
      !url.includes('reddit.com') &&
      url.match(/^https?:\/\//) &&
      !['default', 'self', 'nsfw', 'spoiler'].includes(url)
    );
    const imageUrl = possibleUrls[0];
    if (imageUrl) {
      setSelectedMedia({
        type: post.selftext ? 'image-text' : 'image',
        url: imageUrl.replace(/&/g, '&'),
        content: post.selftext || null,
        scale: 1,
        post,
        panelHeightPx: panelHeightRef.current
      });
    }
  };

  const handleVideoClick = (post) => {
    // New logic: Check for Redgifs URL and embed it in an iframe
    if (post.url && post.url.includes('redgifs.com')) {
      setSelectedMedia({
        type: 'redgifs',
        url: post.url,
        post,
        panelHeightPx: panelHeightRef.current
      });
      return;
    }

    const videoInfo = getVideoUrl(post);
    if (videoInfo) {
      if (videoInfo.type === 'youtube') {
        setSelectedMedia({
          type: 'youtube',
          videoId: videoInfo.videoId,
          hasAudio: true,
          post,
          panelHeightPx: panelHeightRef.current
        });
      } else {
        setSelectedMedia({
          type: 'video',
          dashUrl: videoInfo.dashUrl,
          videoUrl: videoInfo.videoUrl,
          audioUrl: videoInfo.audioUrl,
          hasAudio: videoInfo.hasAudio,
          post,
          panelHeightPx: panelHeightRef.current
        });
      }
    }
  };

  const handleAlbumClick = (post) => {
    if (!post.is_gallery || !post.gallery_data || !post.media_metadata) return;
    const images = post.gallery_data.items.map(item => {
      const meta = post.media_metadata[item.media_id];
      if (meta) {
        const bestImage = meta.p?.[meta.p.length - 1]?.u || meta.s?.u;
        if (bestImage) {
          return bestImage.replace(/&amp;/g, '&');
        }
      }
      return null;
    }).filter(Boolean);
    if (images.length > 0) {
      setSelectedMedia({
        type: 'album',
        images,
        currentIndex: 0,
        scale: 1,
        post,
        panelHeightPx: panelHeightRef.current
      });
    }
  };

  useEffect(() => {
    const handleResizeWindow = () => {
      const maxW = window.innerWidth;
      const maxH = window.innerHeight - headerHeight;
      setPanelWidthPx(prev => Math.min(prev, maxW - 20));
      setPanelHeightPx(prev => Math.min(prev, maxH - 20));
      setPanelPosition(prev => {
        const w = Math.min(panelWidthRef.current, maxW - 20);
        const h = Math.min(panelHeightRef.current, maxH - 20);
        const x = Math.max(0, Math.min(prev.x, maxW - w - 8));
        const y = Math.max(headerHeight, Math.min(prev.y, maxH - h + headerHeight));
        return { x, y };
      });

      const svgEl = svgRef.current;
      if (svgEl) {
        svgEl.style.width = '100%';
        svgEl.style.height = `${maxH}px`;
      }
    };

    window.addEventListener('resize', handleResizeWindow);
    handleResizeWindow();
    return () => window.removeEventListener('resize', handleResizeWindow);
  }, []);

  if (loading) {
    return React.createElement("div", {className: "loading"}, `Loading ${subreddit === 'all' ? '/r/all' : `/r/${subreddit}`} bubbles...`);
  }

  return React.createElement("div", {style:{width:"100%",height:"100%",position:"relative",overflow:"hidden"}},
    React.createElement("header", null,
      React.createElement("span", null, "Reddit Word Map"),
      React.createElement("input", {
        type: "text",
        className: "subreddit-input",
        placeholder: "Enter subreddit (e.g., videos)",
        value: inputValue,
        onChange: handleInputChange,
        onKeyDown: handleKeyDown
      }),
      React.createElement("button", { className: "search-btn", onClick: handleSearch }, "Search"),
      React.createElement("div", { className: "cog-container" },
        React.createElement("span", {
          className: "cog-icon",
          onClick: toggleSettingsMenu
        }, "⚙️"),
        isSettingsOpen && React.createElement("div", { className: "settings-menu" },
          React.createElement("div", {
            onClick: openColorsSubmenu,
            onMouseEnter: (e) => e.target.style.background = '#555',
            onMouseLeave: (e) => e.target.style.background = ''
          }, "Colors"),
          isColorsOpen && React.createElement("div", { className: "colors-submenu" },
            Object.entries(gradientPairs).map(([pair, { color1, color2 }]) => (
              React.createElement("div", {
                key: pair,
                className: "color-option",
                onClick: () => handleGradientSelect(pair)
              },
                React.createElement("div", {
                  className: "color-box",
                  style: { background: color1 },
                  onClick: (e) => {
                    e.stopPropagation();
                    setIsSettingsOpen(false);
                    setIsColorsOpen(false);
                    setCustomGradient(prev => ({ ...prev, editing: 'color1', pair }));
                  }
                }),
                React.createElement("div", {
                  className: "color-box",
                  style: { background: color2 },
                  onClick: (e) => {
                    e.stopPropagation();
                    setIsSettingsOpen(false);
                    setIsColorsOpen(false);
                    setCustomGradient(prev => ({ ...prev, editing: 'color2', pair }));
                  }
                }),
                pair.replace('-', '/')
              )
            )),
            customGradient?.editing && React.createElement("input", {
              type: "color",
              className: "color-picker",
              value: gradientPairs[customGradient.pair][customGradient.editing],
              onChange: (e) => handleColorChange(customGradient.editing, e.target.value),
              onBlur: () => setCustomGradient(prev => ({ ...prev, editing: null }))
            })
          )
        )
      )
    ),
    React.createElement("svg", {ref: svgRef}),
    selectedWord && React.createElement("div", {
        className: "posts-container",
        ref: postsContainerRef,
        style: {
          top: `${panelPosition.y}px`,
          left: `${panelPosition.x}px`,
          width: `${Math.min(panelWidthPx, window.innerWidth - 20)}px`,
          height: `${Math.min(selectedMedia?.panelHeightPx || panelHeightPx, window.innerHeight - headerHeight - 20)}px`
        }
      },
      React.createElement("div", {
        className: "resize-handle-top",
        onMouseDown: (e) => handleResizeStart(e, 'top')
      }),
      React.createElement("button", {
        className: "close-btn",
        onClick: () => {
          setSelectedWord(null);
          setSelectedMedia(null);
        }
      }, "✕"),
      React.createElement("h3", {
        onMouseDown: (e) => {
          if (e.target === e.currentTarget) {
            handleDragStart(e);
          }
        }
      }, `${selectedWord.posts.length} posts containing the word "${selectedWord.word}"`),
      !selectedMedia && React.createElement("select", {
        className: "sort-select",
        value: postSort,
        onChange: (e) => setPostSort(e.target.value)
      },
        React.createElement("option", {value: "api"}, "API Order"),
        React.createElement("option", {value: "score-desc"}, "Score Descending"),
        React.createElement("option", {value: "score-asc"}, "Score Ascending"),
        React.createElement("option", {value: "title-asc"}, "Title Ascending"),
        React.createElement("option", {value: "created-desc"}, "Newest First")
      ),
      !selectedMedia && (function() {
        const sortedPosts = [...selectedWord.posts];
        if (postSort === "score-desc") {
          sortedPosts.sort((a, b) => (b.score || 0) - (a.score || 0));
        } else if (postSort === "score-asc") {
          sortedPosts.sort((a, b) => (a.score || 0) - (b.score || 0));
        } else if (postSort === "title-asc") {
          sortedPosts.sort((a, b) => a.title.localeCompare(b.title));
        } else if (postSort === "created-desc") {
          sortedPosts.sort((a, b) => b.created - a.created);
        }
        return React.createElement("ul", {className: "posts-list"}, sortedPosts.map(post =>
          React.createElement("li", {key: post.id || post.name},
            React.createElement("div", {className: "upvote-container"},
              React.createElement("span", {className: "upvote-arrow"}, "↑"),
              React.createElement("div", {className: "upvote-score"}, post.score != null ? post.score : "0")
            ),
            React.createElement("div", {className: "post-content"},
              React.createElement("a", {
                href: post.url && post.url.match(/^https?:\/\//) ? post.url : `https://reddit.com${post.permalink}`,
                target: "_blank",
                rel: "noreferrer"
              }, post.title),
              React.createElement("br"),
              React.createElement("small", null, `by ${post.author} | ${post.subreddit_name_prefixed}`)
            ),
            React.createElement("div", {className: "buttons"},
              hasValidImage(post) && !post.is_gallery && !getYouTubeVideoId(post.url) && !post.url.includes('redgifs.com') && React.createElement("button", {
                className: "image-btn",
                onClick: () => handleImageClick(post)
              }, "Show Image"),
              post.is_gallery && React.createElement("button", {
                className: "album-btn",
                onClick: () => handleAlbumClick(post)
              }, "Show Album"),
              (getVideoUrl(post) || (post.url && post.url.includes('redgifs.com'))) && React.createElement("button", {
                className: "video-btn",
                onClick: () => handleVideoClick(post)
              }, "Play Video"),
              React.createElement("button", {
                className: "comments-btn",
                onClick: () => {
                  window.open(`https://reddit.com${post.permalink}`, '_blank');
                }
              }, "Comments")
            )
          )
        ));
      })(),
      selectedMedia && React.createElement("div", {className: "selected-post"},
        React.createElement("div", {className: "upvote-container"},
          React.createElement("span", {className: "upvote-arrow"}, "↑"),
          React.createElement("div", {className: "upvote-score"}, selectedMedia.post.score != null ? selectedMedia.post.score : "0")
        ),
        React.createElement("div", {className: "post-content"},
          React.createElement("a", {
            href: selectedMedia.post.url && selectedMedia.post.url.match(/^https?:\/\//) ? selectedMedia.post.url : `https://reddit.com${selectedMedia.post.permalink}`,
            target: "_blank",
            rel: "noreferrer"
          }, selectedMedia.post.title),
          React.createElement("br"),
          React.createElement("small", null, `by ${selectedMedia.post.author} | ${selectedMedia.post.subreddit_name_prefixed}`)
        )
      ),
      selectedMedia && (function() {
        if (selectedMedia.type === 'image') {
          return React.createElement("div", {className: "image-container"},
            React.createElement("button", {className: "close-btn", onClick: () => {
              setSelectedMedia(null);
            }}, "✕"),
            React.createElement("div", {className: "image-controls"},
              React.createElement("button", {className: "resize-btn", onClick: () => handleResize('increase')}, "+"),
              React.createElement("button", {className: "resize-btn", onClick: () => handleResize('decrease')}, "−")
            ),
            React.createElement("img", {
              ref: mediaRef,
              src: selectedMedia.url,
              alt: "Post image",
              onMouseDown: handleMouseDownMedia,
              onError: () => setSelectedMedia(null)
            })
          );
        } else if (selectedMedia.type === 'image-text') {
          return React.createElement("div", {className: "image-text-container"},
            React.createElement("button", {className: "close-btn", onClick: () => {
              setSelectedMedia(null);
            }}, "✕"),
            React.createElement("div", {className: "image-controls"},
              React.createElement("button", {className: "resize-btn", onClick: () => handleResize('increase')}, "+"),
              React.createElement("button", {className: "resize-btn", onClick: () => handleResize('decrease')}, "−")
            ),
            React.createElement("img", {
              ref: mediaRef,
              src: selectedMedia.url,
              alt: "Post image",
              onMouseDown: handleMouseDownMedia,
              onError: () => setSelectedMedia(null)
            }),
            React.createElement("pre", {className: "text-content"}, selectedMedia.content)
          );
        } else if (selectedMedia.type === 'video') {
          return React.createElement("div", {className: "video-container"},
            React.createElement("button", {className: "close-btn", onClick: () => {
              setSelectedMedia(null);
            }}, "✕"),
            !selectedMedia.hasAudio && !selectedMedia.dashUrl && React.createElement("div", {className: "no-audio-notice"}, "Video may not have audio due to Reddit API limitations"),
            React.createElement("div", {className: "image-controls"},
              React.createElement("button", {className: "resize-btn", onClick: () => handleResize('increase')}, "+"),
              React.createElement("button", {className: "resize-btn", onClick: () => handleResize('decrease')}, "−")
            ),
            selectedMedia.dashUrl
              ? React.createElement("video", {
                  ref: mediaRef,
                  controls: true,
                  autoPlay: true,
                  loop: true,
                  muted: false,
                  onError: () => setSelectedMedia(null)
                })
              : React.createElement("video", {
                  ref: mediaRef,
                  controls: true,
                  autoPlay: true,
                  loop: true,
                  muted: false,
                  onError: () => setSelectedMedia(null)
                },
                  React.createElement("source", {src: selectedMedia.videoUrl, type: "video/mp4"}),
                  selectedMedia.audioUrl ? React.createElement("source", {src: selectedMedia.audioUrl, type: "audio/mp4"}) : null
                )
          );
        } else if (selectedMedia.type === 'youtube') {
          return React.createElement("div", {className: "video-container"},
            React.createElement("button", {className: "close-btn", onClick: () => {
              setSelectedMedia(null);
            }}, "✕"),
            React.createElement("div", {className: "image-controls"},
              React.createElement("button", {className: "resize-btn", onClick: () => handleResize('increase')}, "+"),
              React.createElement("button", {className: "resize-btn", onClick: () => handleResize('decrease')}, "−")
            ),
            React.createElement("div", {className: "embed-wrapper"},
              React.createElement("iframe", {
                src: `https://www.youtube-nocookie.com/embed/${selectedMedia.videoId}`,
                frameBorder: "0",
                allow: "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen",
                title: "YouTube video",
                onError: () => {
                  setSelectedMedia({
                    type: 'image',
                    url: `https://img.youtube.com/vi/${selectedMedia.videoId}/hqdefault.jpg`,
                    content: `Embedding restricted. View video on YouTube: https://www.youtube.com/watch?v=${selectedMedia.videoId}`,
                    scale: 1,
                    post: selectedMedia.post,
                    panelHeightPx: selectedMedia.panelHeightPx
                  });
                }
              })
            )
          );
        } else if (selectedMedia.type === 'album') {
          return React.createElement("div", {className: "album-container"},
            React.createElement("button", {className: "close-btn", onClick: () => {
              setSelectedMedia(null);
            }}, "✕"),
            React.createElement("div", {className: "image-controls"},
              React.createElement("button", {className: "resize-btn", onClick: () => handleResize('increase')}, "+"),
              React.createElement("button", {className: "resize-btn", onClick: () => handleResize('decrease')}, "−")
            ),
            React.createElement("img", {
              ref: mediaRef,
              src: selectedMedia.images[selectedMedia.currentIndex],
              alt: "Album image",
              onMouseDown: handleMouseDownMedia,
              onError: () => setSelectedMedia(null)
            }),
            React.createElement("div", {style: {position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px'}},
              React.createElement("button", {
                disabled: selectedMedia.currentIndex === 0,
                onClick: () => setSelectedMedia(prev => ({...prev, currentIndex: prev.currentIndex - 1}))
              }, "Prev"),
              React.createElement("button", {
                disabled: selectedMedia.currentIndex === selectedMedia.images.length - 1,
                onClick: () => setSelectedMedia(prev => ({...prev, currentIndex: prev.currentIndex + 1}))
              }, "Next")
            )
          );
        } else if (selectedMedia.type === 'redgifs') {
          // Construct the embed URL using the video ID
          const videoId = selectedMedia.url.split('/').pop();
          const embedUrl = `https://www.redgifs.com/ifr/${videoId}`;

          return React.createElement("div", {className: "video-container"},
            React.createElement("button", {className: "close-btn", onClick: () => {
              setSelectedMedia(null);
            }}, "✕"),
            React.createElement("iframe", {
              src: embedUrl, // Use the constructed embed URL here
              frameBorder: "0",
              allowFullScreen: true,
              sandbox: "allow-scripts allow-same-origin",
              style: { width: "100%", height: "100%" }
            })
          );
        }
      })(),
      React.createElement("div", {
        className: "resize-handle-bottom",
        onMouseDown: (e) => handleResizeStart(e, 'vertical')
      }),
      React.createElement("div", {
        className: "resize-handle-right",
        onMouseDown: (e) => handleResizeStart(e, 'horizontal')
      }),
      React.createElement("div", {
        className: "resize-handle-left",
        onMouseDown: (e) => handleResizeStart(e, 'left')
      })
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(RedditWordMap));
