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

const templates = {
    "現場の定着率・離職率に関するご相談": "【現在の課題】\n（例：採用しても数ヶ月で辞めてしまう、夜勤の定着が悪い 等）\n\n\n【希望するサポート】\n（例：定着率を上げるための現場フォローをお願いしたい、など）\n\n\n【その他・備考】\n",
    
    "急な人材不足・増員に関するご相談": "【必要な人数と時期】\n（例：来月から〇名、早急に〇名追加したい 等）\n\n\n【業務内容・求めるスキル】\n（例：ライン作業、フォークリフト免許必須、など）\n\n\n【その他・備考】\n",
    
    "外国人材の活用・労務管理に関するご相談": "【現状と課題】\n（例：外国人材の受け入れに興味があるが手続きが不安、言語の壁でトラブルが起きている 等）\n\n\n【聞いてみたいこと】\n（例：生活サポートや通訳の具体的な内容を知りたい、など）\n\n\n【その他・備考】\n",
    
    "その他のお問い合わせ": "ご質問やご相談内容を自由にご記入ください。\n\n"
};

// テンプレート切り替え機能
if (subjectSelect && contentsArea) {
    subjectSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        const currentValue = contentsArea.value;
        const isUnmodified = currentValue === "" || Object.values(templates).includes(currentValue);
        
        if (templates[selectedValue] && isUnmodified) {
            contentsArea.value = templates[selectedValue];
            
            // 背景色を一瞬青くして変更を通知するアニメーション
            contentsArea.classList.remove('bg-gray-50');
            contentsArea.classList.add('bg-green-100');
            setTimeout(() => {
                contentsArea.classList.remove('bg-green-100');
                contentsArea.classList.add('bg-gray-50');
            }, 500);
        }
    });
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