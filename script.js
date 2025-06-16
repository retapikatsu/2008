document.addEventListener('DOMContentLoaded', function() {
    // この行は、ウェブページが完全に読み込まれた後に、中のコードを実行するというおまじないです。
    // これがないと、HTMLの要素が見つからずにエラーになることがあります。

    // スムーズスクロールの機能
    // ウェブページ内のリンク（aタグ）で、href属性が「#」で始まるもの全てを探し出します。
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // 見つかった各リンクに対して、クリックされたときの処理を設定します。
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); // リンク本来の動き（ページ上部にジャンプする）をキャンセルします。

            // クリックされたリンクのhref属性の値（例：#about-tapioka）を取得します。
            const targetId = this.getAttribute('href');
            // そのIDを持つHTML要素（セクションなど）をウェブページの中から探し出します。
            const targetElement = document.querySelector(targetId);

            // もし対象の要素が見つかったら、以下の処理を実行します。
            if (targetElement) {
                // ヘッダーの高さ（固定ヘッダーが邪魔にならないように）を取得します。
                const headerOffset = document.querySelector('.header').offsetHeight;
                // 対象要素の現在の位置（ページの一番上からの距離）を計算します。
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                // スクロール先の最終位置を計算します（ヘッダーの高さ分を引いて少し上にずらす）。
                const offsetPosition = elementPosition - headerOffset;

                // ページのスクロールを滑らかに（smooth）指定した位置まで行います。
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // モーダル表示の機能（汎用版、今回は診断モーダルのみに使用）
    // 'modal-trigger'クラスを持つボタン（「MYタピオカ診断」ボタンなど）を全て探し出します。
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    // 'modal'クラスを持つ要素（モーダルの背景と内容全体）を全て探し出します。
    const modals = document.querySelectorAll('.modal');
    // 'close-button'クラスを持つボタン（モーダルの閉じるボタン「×」）を全て探し出します。
    const closeButtons = document.querySelectorAll('.close-button');

    // 各モーダル起動ボタン（modalTriggers）に対して、クリックされたときの処理を設定します。
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            // クリックされたボタンの'data-modal-target'属性から、開きたいモーダルのIDを取得します。
            // 例: 'diagnosis-modal'
            const modalId = this.dataset.modalTarget;
            // そのIDを持つモーダル要素をウェブページの中から探し出します。
            const modal = document.getElementById(modalId);

            // もしモーダルが見つかったら、以下の処理を実行します。
            if (modal) {
                modal.style.display = 'flex'; // モーダルを表示します（CSSでdisplay:noneからdisplay:flexに変わる）。
            }
        });
    });

    // 各閉じるボタン（closeButtons）に対して、クリックされたときの処理を設定します。
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // クリックされた閉じるボタンから、最も近い親のモーダル要素を探します。
            const modal = this.closest('.modal');
            // もしモーダルが見つかったら、以下の処理を実行します。
            if (modal) {
                modal.style.display = 'none'; // モーダルを非表示にします。

                // もし閉じられたモーダルが診断モーダル（idが'diagnosis-modal'）だった場合、
                if (modal.id === 'diagnosis-modal') {
                    // あだ名入力欄のテキストを空にします。
                    document.getElementById('nickname-input').value = '';
                }
            }
        });
    });

    // モーダルの外側をクリックで閉じる機能
    // ウェブページ全体（window）に対して、クリックされたときの処理を設定します。
    window.addEventListener('click', function(event) {
        // 表示されている可能性のある全てのモーダルに対して以下の処理を実行します。
        modals.forEach(modal => {
            // もしクリックされた場所が、モーダル自体（モーダル内のコンテンツではない背景部分）だった場合、
            if (event.target == modal) {
                modal.style.display = 'none'; // モーダルを非表示にします。

                // もし閉じられたモーダルが診断モーダルだった場合、
                if (modal.id === 'diagnosis-modal') {
                    // あだ名入力欄のテキストを空にします。
                    document.getElementById('nickname-input').value = '';
                }
            }
        });
    });

    // MYタピオカ診断モーダルとタイトル変更の機能
    // 「決定(^_-)-☆」ボタンの要素を取得します。
    const submitNicknameButton = document.getElementById('submit-nickname');
    // あだ名入力欄の要素を取得します。
    const nicknameInput = document.getElementById('nickname-input');
    // MYタピオカ診断モーダル全体の要素を取得します。
    const diagnosisModal = document.getElementById('diagnosis-modal');
    // メインタイトル上部（「あれから17年」の部分）の要素を取得します。
    const mainTitleTop = document.getElementById('main-title-top');
    // メインタイトル下部（「学生の心を取り戻せ♡Reタピ活」の部分）の要素を取得します。
    const mainTitleBottom = document.getElementById('main-title-bottom');

    // 「決定(^_-)-☆」ボタンがクリックされたときの処理を設定します。
    submitNicknameButton.addEventListener('click', function() {
        // あだ名入力欄に入力されたテキストを取得し、前後の空白を取り除きます。
        const nickname = nicknameInput.value.trim();

        // もしあだ名が何か入力されていた場合（空でなかった場合）は、以下の処理を実行します。
        if (nickname) {
            // メインタイトル上部のテキストを「（入力されたあだ名）・あれから17年」に書き換えます。
            // ここを変えると、メインタイトルの上の行の文章が変わるよ！
            // 例: 「タピちゃん・あれから17年」
            mainTitleTop.textContent = `${nickname}・あれから17年`;
            // メインタイトル下部のテキストを「学生の心を取り戻そう♡Reタピ活」に書き換えます。
            // ここを変えると、メインタイトルの下の行の文章が変わるよ！
            mainTitleBottom.textContent = `学生の心を取り戻そう♡Reタピ活`;
        } else {
            // あだ名が空だった場合は、元のタイトルに戻します（またはエラーメッセージを表示）。
            mainTitleTop.textContent = 'あれから17年';
            mainTitleBottom.textContent = '学生の心を取り戻せ♡Reタピ活';
            alert('あだ名を入力してください！'); // 例として、アラートで注意を促します。
        }

        diagnosisModal.style.display = 'none'; // モーダルを非表示にします。
        nicknameInput.value = ''; // あだ名入力欄を空にします。
    });
});