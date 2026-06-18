// === スパム対策：クリック時のみ暗号化解除＆表示・コピー ===
// クリップボードAPIフォールバック
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    var successful = false;
    try {
        successful = document.execCommand('copy');
    } catch (err) {}
    document.body.removeChild(textArea);
    return successful;
}

// 連絡先メールアドレスをBase64で難読化して保持
function showAndCopyEmail(btn) {
    const encoded = 'aW5mb0Bqb2Jjb25uZWN0aW9ucy5qcA==';
    const e = atob(encoded); 
    
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(e).then(() => {
            updateBtnUI(btn, e, true);
        }).catch(() => {
            copied = fallbackCopyTextToClipboard(e);
            updateBtnUI(btn, e, copied);
        });
    } else {
        copied = fallbackCopyTextToClipboard(e);
        updateBtnUI(btn, e, copied);
    }
}

function updateBtnUI(btn, email, isCopied) {
    let html = `<span class="select-all font-medium text-primary text-lg md:text-base">${email}</span>`;
    if (isCopied) {
        html += `<span class="text-xs text-green-600 font-bold ml-3 bg-green-50 px-2 py-1 rounded"><i class="fa-solid fa-check"></i> コピーしました</span>`;
    }
    const wrapper = document.createElement('span');
    wrapper.className = "flex items-center flex-wrap gap-1 mt-1 md:mt-0";
    wrapper.innerHTML = html;
    btn.parentNode.replaceChild(wrapper, btn);
}

// === フォームの動的テンプレート機能 ===
const subjectSelect = document.getElementById('subject');
const contentsArea = document.getElementById('contents');

let templates = {}; 
let templateValues = new Set();

// サイト読み込み時にJSONを取得
fetch('assets/templates/subject.json')
    .then(response => response.json())
    .then(data => {
        templates = data;
        templateValues = new Set(Object.values(templates));
    })
    .catch(err => console.error("テンプレートの読み込みに失敗しました", err));

// テンプレート切り替え機能
if (subjectSelect && contentsArea) {
    subjectSelect.addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        const template = templates[selectedValue];
        
        // テンプレートが存在し、かつ「空」または「以前のテンプレート」なら上書き
        if (template && (contentsArea.value === "" || templateValues.has(contentsArea.value))) {
            contentsArea.value = template;
            flashBackground(contentsArea);
        }
    });
}

function flashBackground(el) {
    el.classList.replace('bg-gray-50', 'bg-green-100');
    setTimeout(() => el.classList.replace('bg-green-100', 'bg-gray-50'), 500);
}

// 詳細欄フォーカス連動ツールチップ機能
const contentsTooltip = document.getElementById('contents-tooltip');
if (contentsArea && contentsTooltip && subjectSelect) {
    contentsArea.addEventListener('focus', function() {
        // 表題がまだ未選択（初期値の空文字）の場合のみ、ふわっとアドバイスを表示
        if (subjectSelect.value === "") {
            contentsTooltip.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
            contentsTooltip.classList.add('opacity-100', 'translate-y-0');
        }
    });

    // フォーカスが外れたらフェードアウト
    contentsArea.addEventListener('blur', function() {
        contentsTooltip.classList.remove('opacity-100', 'translate-y-0');
        contentsTooltip.classList.add('opacity-0', 'translate-y-2', 'pointer-events-none');
    });

    // ユーザーが文字を書き始めたら邪魔なので消す
    contentsArea.addEventListener('input', function() {
        contentsTooltip.classList.remove('opacity-100', 'translate-y-0');
        contentsTooltip.classList.add('opacity-0', 'translate-y-2', 'pointer-events-none');
    });

    // 表題が選ばれた場合も即座に消去
    subjectSelect.addEventListener('change', function() {
        contentsTooltip.classList.remove('opacity-100', 'translate-y-0');
        contentsTooltip.classList.add('opacity-0', 'translate-y-2', 'pointer-events-none');
    });
}



// === SPAルーティング制御 ===
function handleRouting() {
    const hash = window.location.hash || '#home';
    
    document.querySelectorAll('.page-content').forEach(el => {
        el.classList.remove('active');
    });

    if (hash === '#privacy') {
        document.getElementById('page-privacy').classList.add('active');
        window.scrollTo(0, 0);
    } else {
        document.getElementById('page-home').classList.add('active');
        
        if (hash !== '#home' && hash.length > 1) {
            const sectionId = hash.substring(1);
            const el = document.getElementById(sectionId);
            if (el) {
                setTimeout(() => {
                    // ヘッダーの高さを考慮してスクロール位置を調整
                    const headerOffset = 80;
                    const elementPosition = el.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }, 50);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    handleRouting();
});
window.addEventListener('hashchange', handleRouting);

// === モバイルハンバーガーメニュー制御 ===
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const menuIcon = mobileMenuButton.querySelector('i');

function toggleMenu() {
    mobileMenu.classList.toggle('hidden');
    if (mobileMenu.classList.contains('hidden')) {
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
    } else {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');
    }
}

mobileMenuButton.addEventListener('click', toggleMenu);

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMenu();
        }
    });
});