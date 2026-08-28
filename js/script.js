

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


// 모바일 메뉴 보완: People / Publications / Board 클릭 시 하위항목을 선택할 수 있게 처리
(function(){
  function isMobileMenu(){
    return window.innerWidth <= 900;
  }

  document.querySelectorAll('.nav-item-dropdown > .nav-link').forEach(parentLink => {
    parentLink.addEventListener('click', function(event){
      if(!isMobileMenu()) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const dropdown = parentLink.closest('.nav-item-dropdown');
      if(dropdown){
        dropdown.classList.toggle('open');
      }
    }, true);
  });

  document.querySelectorAll('.nav-item-dropdown .dropdown-menu a').forEach(childLink => {
    childLink.addEventListener('click', function(event){
      if(!isMobileMenu()) return;
      event.stopPropagation();
    }, true);
  });
})();


// 모바일 메뉴 최종 보정:
// 1) 햄버거 메뉴를 열면 하위항목은 닫힌 상태
// 2) People / Publications / Board 상위항목 클릭 시 해당 기본 페이지로 이동
// 3) 동시에 해당 하위항목 메뉴만 펼쳐서 Members, Papers, Gallery 등을 선택 가능하게 함
(function(){
  function isMobileMenuFinal(){
    return window.innerWidth <= 900;
  }

  const navToggleFinal = document.getElementById('navToggle');
  const navMenuFinal = document.getElementById('navMenu');

  if (navToggleFinal && navMenuFinal) {
    navToggleFinal.addEventListener('click', function(){
      setTimeout(function(){
        if (navMenuFinal.classList.contains('open')) {
          document.querySelectorAll('.nav-item-dropdown').forEach(dropdown => {
            dropdown.classList.remove('open');
          });
        }
      }, 0);
    });
  }

  const mobileParentMap = {
    'nav-people': { page: 'professor' },
    'nav-publications': { page: 'publications', sub: 'paper' },
    'nav-board': { page: 'board', sub: 'news' }
  };

  document.querySelectorAll('.nav-item-dropdown > .nav-link').forEach(parentLink => {
    parentLink.addEventListener('click', function(event){
      if (!isMobileMenuFinal()) return;

      const parentId = parentLink.id;
      const target = mobileParentMap[parentId];
      if (!target) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const dropdown = parentLink.closest('.nav-item-dropdown');
      const wasOpen = dropdown && dropdown.classList.contains('open');

      // 상위항목 클릭 시 해당 기본 페이지로 이동
      if (typeof navigateTo === 'function') {
        navigateTo(target.page, target.sub);
      }

      // navigateTo에서 모바일 메뉴가 닫히므로 다시 열고, 선택한 하위항목만 펼침
      if (navMenuFinal) {
        navMenuFinal.classList.add('open');
      }

      document.querySelectorAll('.nav-item-dropdown').forEach(item => {
        item.classList.remove('open');
      });

      if (dropdown && !wasOpen) {
        dropdown.classList.add('open');
      } else if (dropdown && wasOpen) {
        // 이미 열려 있던 상태에서 다시 누르면 페이지 이동은 유지하되 하위항목은 접음
        dropdown.classList.remove('open');
      }
    }, true);
  });

  // 하위항목 클릭 시에는 기존 navigateTo가 정상 실행되고 메뉴가 닫히도록 함
  document.querySelectorAll('.nav-item-dropdown .dropdown-menu a').forEach(childLink => {
    childLink.addEventListener('click', function(event){
      if (!isMobileMenuFinal()) return;
      event.stopPropagation();
    }, true);
  });
})();


// 모바일 하위항목 클릭 이동 최종 보정:
// Principal Investigator / Members / Papers / Patents / News / Gallery 클릭 시
// 기존 inline onclick 충돌 여부와 관계없이 해당 페이지로 직접 이동하도록 고정
(function(){
  function isMobileSubmenu(){
    return window.innerWidth <= 900;
  }

  function normalizeText(text){
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  const submenuRouteMap = {
    'Principal Investigator': { page: 'professor' },
    'Members': { page: 'member' },
    'Papers': { page: 'publications', sub: 'paper' },
    'Patents': { page: 'publications', sub: 'patent' },
    'News': { page: 'board', sub: 'news' },
    'Gallery': { page: 'board', sub: 'gallery' }
  };

  document.querySelectorAll('.nav-item-dropdown .dropdown-menu a').forEach(link => {
    link.addEventListener('click', function(event){
      if (!isMobileSubmenu()) return;

      const label = normalizeText(link.textContent);
      const route = submenuRouteMap[label];
      if (!route) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (typeof navigateTo === 'function') {
        navigateTo(route.page, route.sub);
      }

      const navMenu = document.getElementById('navMenu');
      if (navMenu) {
        navMenu.classList.remove('open');
      }

      document.querySelectorAll('.nav-item-dropdown').forEach(dropdown => {
        dropdown.classList.remove('open');
      });
    }, true);
  });
})();
