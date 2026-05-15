<?php
/**
 * WordPress snippet for CPT plus_lesson:
 * - Adds shortcode [plus_lesson_ldr_viewer]
 * - Reads LDR file URL from post meta _plus_ldr_file
 * - Renders interactive viewer (rotate/zoom) with step-by-step navigation
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('wp_enqueue_scripts', function () {
    wp_register_script(
        'plus-ldr-aio',
        'https://cdn.jsdelivr.net/gh/discursus/LDraw_Model_Viewer@main/public_ldr/res/ldr-aio.min.js',
        [],
        null,
        true
    );
});

add_shortcode('plus_lesson_ldr_viewer', function ($atts = []) {
    if (!is_singular('plus_lesson')) {
        return '';
    }

    $post_id = get_the_ID();
    if (!$post_id) {
        return '';
    }

    $model_url = get_post_meta($post_id, '_plus_ldr_file', true);
    if (empty($model_url)) {
        return '<div class="plus-ldr-viewer-empty">Файл модели для этого занятия не прикреплён.</div>';
    }

    wp_enqueue_script('plus-ldr-aio');

    $uid = 'plus-ldr-' . $post_id . '-' . wp_rand(1000, 9999);
    $safe_model_url = esc_url_raw($model_url);

    ob_start();
    ?>
    <div id="<?php echo esc_attr($uid); ?>" class="plus-ldr-widget" data-model-url="<?php echo esc_attr($safe_model_url); ?>">
        <div class="plus-ldr-toolbar">
            <button type="button" class="plus-ldr-btn" data-act="prev">◀ Шаг</button>
            <span class="plus-ldr-step-label">Шаг: <span data-role="step-current">1</span>/<span data-role="step-total">1</span></span>
            <button type="button" class="plus-ldr-btn" data-act="next">Шаг ▶</button>
            <button type="button" class="plus-ldr-btn" data-act="reset">Сброс вида</button>
        </div>
        <div class="plus-ldr-progress" data-role="progress">Загрузка модели…</div>
        <div class="plus-ldr-canvas-wrap">
            <canvas data-role="canvas"></canvas>
        </div>
    </div>

    <style>
        #<?php echo esc_html($uid); ?> { border:1px solid #ddd; border-radius:8px; padding:12px; background:#fff; }
        #<?php echo esc_html($uid); ?> .plus-ldr-toolbar { display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:10px; }
        #<?php echo esc_html($uid); ?> .plus-ldr-btn { border:1px solid #ccc; background:#f7f7f7; padding:6px 10px; border-radius:6px; cursor:pointer; }
        #<?php echo esc_html($uid); ?> .plus-ldr-canvas-wrap { min-height:560px; border:1px solid #e7e7e7; border-radius:6px; overflow:hidden; }
        #<?php echo esc_html($uid); ?> canvas { width:100%; min-height:560px; display:block; }
        #<?php echo esc_html($uid); ?> .plus-ldr-progress { margin-bottom:8px; font-size:14px; color:#666; }
    </style>

    <script>
    (function(){
        const root = document.getElementById('<?php echo esc_js($uid); ?>');
        if (!root || typeof LDrawOrg === 'undefined') return;

        const modelUrl = root.dataset.modelUrl;
        const canvas = root.querySelector('[data-role="canvas"]');
        const progress = root.querySelector('[data-role="progress"]');
        const currentEl = root.querySelector('[data-role="step-current"]');
        const totalEl = root.querySelector('[data-role="step-total"]');

        let scene = null;
        let steps = [];
        let currentStep = 0;

        LDR.Options.bgColor = 0xFFFFFF;
        LDR.Options.studLogo = 2;

        function toDataUrl(text) {
            return 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(text)));
        }

        function splitBySteps(ldrText) {
            const lines = ldrText.split(/\r\n|\n|\r/);
            const indexes = [0];
            for (let i = 0; i < lines.length; i++) {
                if (/^0\s+STEP\b/i.test(lines[i].trim())) {
                    indexes.push(i + 1);
                }
            }

            if (indexes[indexes.length - 1] !== lines.length) {
                indexes.push(lines.length);
            }

            const result = [];
            for (let i = 1; i < indexes.length; i++) {
                result.push(lines.slice(0, indexes[i]).join('\n'));
            }
            return result.length ? result : [ldrText];
        }

        function renderStep(stepIndex) {
            if (!steps[stepIndex]) return;

            currentStep = stepIndex;
            currentEl.textContent = String(currentStep + 1);
            totalEl.textContent = String(steps.length);

            const model = toDataUrl(steps[stepIndex]);
            if (scene) {
                scene = null;
            }

            scene = new LDrawOrg.Model(canvas, model, {
                idToUrl: function(id){ return [id]; },
                idToTextureUrl: function(id){ return id; },
                onProgress: function(id){
                    if (typeof id === 'string' && !id.startsWith('data:')) {
                        progress.textContent = 'Загрузка: ' + id;
                    }
                },
                onLoaded: function(){
                    progress.textContent = 'Готово. Мышь: вращение/зум/панорама.';
                }
            });
        }

        function bindUI() {
            root.querySelector('[data-act="prev"]').addEventListener('click', function(){
                if (currentStep > 0) renderStep(currentStep - 1);
            });
            root.querySelector('[data-act="next"]').addEventListener('click', function(){
                if (currentStep < steps.length - 1) renderStep(currentStep + 1);
            });
            root.querySelector('[data-act="reset"]').addEventListener('click', function(){
                renderStep(currentStep);
            });
        }

        fetch(modelUrl)
            .then(function(resp){
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                return resp.text();
            })
            .then(function(ldrText){
                steps = splitBySteps(ldrText);
                bindUI();
                renderStep(0);
            })
            .catch(function(err){
                progress.textContent = 'Ошибка загрузки модели: ' + err.message;
            });
    })();
    </script>
    <?php

    return ob_get_clean();
});
