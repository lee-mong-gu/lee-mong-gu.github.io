

// 상단 메뉴 재진입 시 상세 화면 초기화: Research 카드 목록으로 복귀
function resetResearchListView() {
  const grid = document.querySelector('#research-page .research-grid');
  const detailView = document.getElementById('research-detail-view');
  const detailPanels = document.querySelectorAll('.research-detail-panel');

  if (grid) {
    grid.style.display = 'grid';
  }
  if (detailView) {
    detailView.style.display = 'none';
  }
  detailPanels.forEach(panel => {
    panel.style.display = 'none';
  });
}

// 상단 Board - Gallery 재진입 시 Gallery 첫 화면으로 복귀
function resetGalleryListView() {
  const listView = document.getElementById('gallery-list-view');
  const detailView = document.getElementById('gallery-detail-view');
  const detailPanels = document.querySelectorAll('.gallery-detail-panel');

  if (listView) {
    listView.style.display = 'block';
  }
  if (detailView) {
    detailView.style.display = 'none';
  }
  detailPanels.forEach(panel => {
    panel.style.display = 'none';
  });
}

// 싱글 페이지 라우팅 스크립트
  function navigateTo(pageId, subPanelId) {
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.classList.remove('active-page'));
    
    const targetPage = document.getElementById(pageId + '-page');
    if(targetPage) {
      targetPage.classList.add('active-page');
    }
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    let activeNavId = 'nav-' + pageId;
    if (pageId === 'professor' || pageId === 'member') {
      activeNavId = 'nav-people';
    }

    const activeLink = document.getElementById(activeNavId);
    if(activeLink) {
      activeLink.classList.add('active');
    }
    
    // 상단 메뉴 클릭 시 이전 상세 화면이 남지 않도록 초기화
    if (pageId === 'research') {
      resetResearchListView();
    }
    if (pageId === 'board' && subPanelId === 'gallery') {
      resetGalleryListView();
    }

    if (subPanelId) {
      switchDirectTab(pageId, subPanelId);
    } else {
      if(pageId === 'publications') switchDirectTab('pub', 'paper');
      if(pageId === 'board') switchDirectTab('board', 'news');
    }
    
    window.scrollTo({ top: 0 });
    document.getElementById('navMenu').classList.remove('open');
  }

  // 내부 특정 패널 활성화 스크립트
  function switchDirectTab(sectionPrefix, tabName) {
    const sectionKey = sectionPrefix === 'publications' ? 'pub' : sectionPrefix;
    const container = document.getElementById((sectionPrefix === 'pub' ? 'publications' : sectionPrefix) + '-page');
    if(!container) return;
    
    const panels = container.querySelectorAll('.tab-panel');
    panels.forEach(panel => panel.classList.remove('active-panel'));
    
    const targetPanel = document.getElementById(sectionKey + '-' + tabName);
    if(targetPanel) {
      targetPanel.classList.add('active-panel');
    }

    updateSubpageBannerTitle(sectionPrefix, tabName);

    // Board - Gallery 탭을 다시 선택하면 항상 목록 첫 화면 표시
    if (sectionKey === 'board' && tabName === 'gallery') {
      resetGalleryListView();
    }
  }

  // Publications / Board 하위 메뉴에 따라 상단 배너 제목 변경
  function updateSubpageBannerTitle(sectionPrefix, tabName) {
    const publicationsTitle = document.getElementById('publications-banner-title');
    const boardTitle = document.getElementById('board-banner-title');

    if ((sectionPrefix === 'publications' || sectionPrefix === 'pub') && publicationsTitle) {
      publicationsTitle.innerHTML = tabName === 'patent' ? '<em>Patents</em>' : '<em>Papers</em>';
    }

    if (sectionPrefix === 'board' && boardTitle) {
      boardTitle.innerHTML = tabName === 'gallery' ? '<em>Gallery</em>' : '<em>News</em>';
    }
  }

  // 모바일 반응형 토글
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // 모바일용 클릭 연동 처리
  const dropdowns = document.querySelectorAll('.nav-item-dropdown');
  dropdowns.forEach(dd => {
    dd.addEventListener('click', (e) => {
      if(window.innerWidth <= 900) {
        dd.classList.toggle('open');
      }
    });
  });

// Board - Gallery 썸네일 클릭 시 메인 이미지 전환
function switchGalleryImage(mainImageId, imageSrc, clickedThumb) {
  const mainImage = document.getElementById(mainImageId);
  if (mainImage) {
    mainImage.src = imageSrc;
  }

  if (clickedThumb && clickedThumb.parentElement) {
    const thumbs = clickedThumb.parentElement.querySelectorAll('.gallery-thumb');
    thumbs.forEach(thumb => thumb.classList.remove('active'));
    clickedThumb.classList.add('active');
  }
}


// Board - Gallery 카드 클릭 시 상세 이미지와 설명 표시/숨김
function toggleGalleryItem(clickedButton) {
  const card = clickedButton.closest('.gallery-expand-card');
  if (!card) return;
  card.classList.toggle('open');
}


// Board - Gallery 상세 화면 전환
function openGalleryDetail(galleryId) {
  const listView = document.getElementById('gallery-list-view');
  const detailView = document.getElementById('gallery-detail-view');
  const detailPanels = document.querySelectorAll('.gallery-detail-panel');

  if (!listView || !detailView) return;

  detailPanels.forEach(panel => panel.style.display = 'none');
  const targetPanel = document.getElementById('gallery-detail-' + galleryId);
  if (targetPanel) {
    targetPanel.style.display = 'block';
  }

  listView.style.display = 'none';
  detailView.style.display = 'block';
  detailView.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (!history.state || history.state.galleryDetail !== galleryId) {
    history.pushState({ galleryDetail: galleryId }, '', '#gallery-' + galleryId);
  }
}

function closeGalleryDetail(useHistoryBack) {
  const listView = document.getElementById('gallery-list-view');
  const detailView = document.getElementById('gallery-detail-view');
  const detailPanels = document.querySelectorAll('.gallery-detail-panel');

  if (!listView || !detailView) return;

  detailPanels.forEach(panel => panel.style.display = 'none');
  detailView.style.display = 'none';
  listView.style.display = 'block';
  listView.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (useHistoryBack && history.state && history.state.galleryDetail) {
    history.back();
  }
}

function handleGalleryCardKey(event, galleryId) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openGalleryDetail(galleryId);
  }
}

window.addEventListener('popstate', function() {
  const detailView = document.getElementById('gallery-detail-view');
  if (detailView && detailView.style.display === 'block') {
    closeGalleryDetail(false);
  }
});


// Research 카드 클릭 시 상세 화면 전환
function openResearchDetail(researchId) {
  const grid = document.querySelector('#research-page .research-grid');
  const detailView = document.getElementById('research-detail-view');
  const detailPanels = document.querySelectorAll('.research-detail-panel');

  if (!grid || !detailView) return;

  detailPanels.forEach(panel => panel.style.display = 'none');
  const targetPanel = document.getElementById('research-detail-' + researchId);
  if (targetPanel) {
    targetPanel.style.display = 'block';
  }

  grid.style.display = 'none';
  detailView.style.display = 'block';
  detailView.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (!history.state || history.state.researchDetail !== researchId) {
    history.pushState({ researchDetail: researchId }, '', '#research-' + researchId);
  }
}

function closeResearchDetail(useHistoryBack) {
  const grid = document.querySelector('#research-page .research-grid');
  const detailView = document.getElementById('research-detail-view');
  const detailPanels = document.querySelectorAll('.research-detail-panel');

  if (!grid || !detailView) return;

  detailPanels.forEach(panel => panel.style.display = 'none');
  detailView.style.display = 'none';
  grid.style.display = 'grid';
  grid.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (useHistoryBack && history.state && history.state.researchDetail) {
    history.back();
  }
}

function handleResearchCardKey(event, researchId) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openResearchDetail(researchId);
  }
}

window.addEventListener('popstate', function() {
  const researchDetailView = document.getElementById('research-detail-view');
  if (researchDetailView && researchDetailView.style.display === 'block') {
    closeResearchDetail(false);
  }
});


function openResearchFromHome(researchId) {
  navigateTo('research');
  window.requestAnimationFrame(() => {
    openResearchDetail(researchId);
  });
}



// Added gallery panel support: open any detail panel matching gallery-detail-{id}
(function(){
  const previousOpenGalleryDetail = window.openGalleryDetail;
  window.openGalleryDetail = function(galleryId){
    const listView = document.getElementById('gallery-list-view');
    const detailView = document.getElementById('gallery-detail-view');
    const panels = document.querySelectorAll('.gallery-detail-panel');
    const target = document.getElementById('gallery-detail-' + galleryId);

    if (listView && detailView && target) {
      listView.style.display = 'none';
      detailView.style.display = 'block';
      panels.forEach(panel => panel.style.display = 'none');
      target.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (typeof previousOpenGalleryDetail === 'function') {
      previousOpenGalleryDetail(galleryId);
    }
  };
})();
