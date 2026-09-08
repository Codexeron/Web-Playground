# 🚀 Web Playground

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with Vanilla JS](https://img.shields.io/badge/Made%20with-Vanilla%20JS-f7df1e.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> **Tarayıcı tabanlı, gelişmiş bir kod editörü ve canlı önizleme aracı.**  
HTML, CSS ve JavaScript dosyalarını düzenleyin, sonuçları anında görün, konsol çıktılarını, ağ isteklerini ve performans metriklerini izleyin. Tamamen istemci taraflı çalışır, verileriniz `localStorage`'da saklanır.

## ✨ Özellikler

- 📁 **Dosya Yönetimi** – Dosya ekleme, silme, düzenleme (HTML, CSS, JS, metin).
- ✍️ **Gelişmiş Editör** – Satır numaraları, sekme desteği (2 boşluk), otomatik kaydetme.
- 🖥️ **Canlı Önizleme** – Iframe içinde anında güncellenen sonuç.
- 📱 **Responsive Test** – Masaüstü (100%), tablet (768px) ve mobil (375px) boyutlarında önizleme.
- 📊 **Konsol** – `console.log`, `console.error` ve `console.warn` mesajlarını yakalar ve gösterir.
- 🌐 **Ağ İzleme** – `fetch` isteklerini yakalar, durum, süre ve boyut bilgilerini sunar.
- ⚡ **Performans** – DOM yüklenme, etkileşim ve toplam yüklenme sürelerini gösterir.
- 🎯 **Picker (Element Seçici)** – Önizlemede bir öğeye tıklayın, CSS selector’ı kopyalayın ve kod içinde o öğenin satırına otomatik gidin.
- 🎨 **Tema Desteği** – Dark, Light, Dracula, Monokai, Solarized ve Codexeron temaları.
- 💾 **Otomatik Kaydetme** – Tüm değişiklikler `localStorage`'a yazılır (tarayıcı kapanınca kaybolmaz).
- ⌨️ **Klavye Kısayolları** – `Ctrl+S` kaydet, `Ctrl+Enter` yeni sekmede önizleme.
- 🔗 **Ayrı Sekmede Önizleme** – `preview.html` ile bağımsız bir önizleme penceresi.

Proje klasörüne gidin:
cd web-playground

Dosya Yapısı;
web-playground/
├── index.html          # Ana uygulama sayfası
├── preview.html        # Ayrı sekmede önizleme sayfası
├── css/
│   └── style.css       # Tüm stiller ve tema tanımları
└── js/
    └── app.js          # Tüm JavaScript mantığı

## 🚀 Hızlı Başlangıç (Kurulum)

1.  Bu repoyu klonlayın veya zip olarak indirin:
    ```bash
    git clone https://github.com/kullanici-adi/web-playground.git
