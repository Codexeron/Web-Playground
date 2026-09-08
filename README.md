# Web Playground 🚀

**Tarayıcı tabanlı, gelişmiş bir kod editörü ve canlı önizleme aracı.**

HTML, CSS ve JavaScript dosyalarını doğrudan tarayıcı üzerinden düzenleyin, sonuçları anında görün, konsol çıktılarını, ağ isteklerini ve performans metriklerini takip edin.

Web Playground tamamen istemci tarafında çalışır ve proje verilerini tarayıcının `localStorage` alanında saklar.

---

## ✨ Özellikler

* 📁 **Dosya Yönetimi**

  * HTML, CSS, JavaScript ve metin dosyaları oluşturma
  * Dosya ekleme ve silme
  * Dosya içeriğini düzenleme
  * Dosyalar arasında hızlı geçiş

* ✍️ **Gelişmiş Kod Editörü**

  * Satır numaraları
  * Sekme desteği
  * Otomatik kaydetme
  * Kod düzenleme desteği

* 🖥️ **Canlı Önizleme**

  * HTML/CSS/JavaScript çıktısını anında görüntüleme
  * Iframe tabanlı izole önizleme
  * Değişiklikleri otomatik olarak yansıtma

* 📱 **Responsive Test**

  * Masaüstü görünümü
  * Tablet görünümü
  * Mobil görünümü
  * Farklı ekran boyutlarında test

* 📊 **Console**

  * `console.log()`
  * `console.warn()`
  * `console.error()`
  * JavaScript hatalarını görüntüleme

* 🌐 **Network Monitoring**

  * `fetch()` isteklerini yakalama
  * HTTP durum kodlarını görüntüleme
  * İstek süresini takip etme
  * İstek boyutlarını görüntüleme

* ⚡ **Performance Monitoring**

  * DOM yüklenme süresi
  * Sayfa yüklenme süresi
  * Etkileşim süreleri
  * Temel performans metrikleri

* 🎯 **Element Picker**

  * Önizleme içerisindeki elementleri seçme
  * CSS selector oluşturma
  * Selector'ı kopyalama
  * İlgili kod satırına hızlıca ulaşma

* 🎨 **Tema Desteği**

  * Dark
  * Light
  * Dracula
  * Monokai
  * Solarized
  * Codexeron

* 💾 **Otomatik Kaydetme**

  * Proje verilerini otomatik olarak `localStorage` içerisinde saklama
  * Tarayıcı kapatılıp açıldığında çalışmaya devam etme

* ⌨️ **Klavye Kısayolları**

  * `Ctrl + S` → Kaydet
  * `Ctrl + Enter` → Yeni sekmede önizleme

* 🖼️ **Tam Ekran**

  * Önizleme panelini tam ekran moduna alma

* 🔗 **Ayrı Sekmede Önizleme**

  * `preview.html` üzerinden bağımsız önizleme
  * Projeyi yeni tarayıcı sekmesinde çalıştırma

---

## 🚀 Kullanım

### 1. Repoyu Klonlayın

```bash
git clone https://github.com/kullanici-adi/web-playground.git
cd web-playground
```

### 2. Projeyi Çalıştırın

Web Playground istemci taraflı çalıştığı için özel bir backend sunucusuna ihtiyaç duymaz.

`index.html` dosyasını doğrudan tarayıcıda açabilirsiniz.

Ancak daha iyi bir geliştirme deneyimi için **VS Code Live Server** veya benzeri bir yerel geliştirme sunucusu kullanmanız önerilir.

Örneğin:

```text
http://localhost:5500
```

---

## 📁 Proje Yapısı

```text
web-playground/
│
├── index.html
│
├── preview.html
│
├── css/
│   └── style.css
│
└── js/
    └── app.js
```

### Dosyaların Görevleri

| Dosya           | Açıklama                       |
| --------------- | ------------------------------ |
| `index.html`    | Ana uygulama arayüzü           |
| `preview.html`  | Ayrı sekmede çalışan önizleme  |
| `css/style.css` | Uygulama stilleri ve temalar   |
| `js/app.js`     | Uygulamanın JavaScript mantığı |

---

## 🛠️ Kullanılan Teknolojiler

* **HTML5**
* **CSS3**
* **Vanilla JavaScript (ES6+)**
* **Flexbox**
* **CSS Grid**
* **CSS Variables**
* **Iframe**
* **localStorage**
* **postMessage**
* **Google Fonts – Inter**

### Mimari

Web Playground tamamen **client-side** bir uygulamadır.

```text
┌───────────────────────────────┐
│        Web Playground         │
├───────────────────────────────┤
│                               │
│  HTML ──┐                     │
│  CSS  ──┼──> Editor ──> Iframe│
│  JS   ──┘                     │
│                               │
├───────────────────────────────┤
│ Console │ Network │ Performance│
├───────────────────────────────┤
│                               │
│          localStorage         │
│                               │
└───────────────────────────────┘
```

Sunucu tarafında herhangi bir veritabanı veya backend gerektirmez.

---

## 🔒 Gizlilik

Web Playground projelerinizi sunucuya göndermek yerine tarayıcı tarafında çalışır.

Proje verileri:

```text
Browser
   │
   └── localStorage
          │
          ├── HTML
          ├── CSS
          ├── JavaScript
          └── Project Settings
```

Bu nedenle oluşturduğunuz projeler varsayılan olarak cihazınızdaki tarayıcı depolama alanında tutulur.

> **Not:** Tarayıcı verilerinin temizlenmesi veya `localStorage` verilerinin silinmesi durumunda kayıtlı projeler kaybolabilir.

---

Önerilen klasör yapısı:

```text
web-playground/
└── screenshots/
    ├── editor.png
    ├── preview.png
    ├── console.png
    └── responsive.png
```

---

## ⌨️ Klavye Kısayolları

| Kısayol        | İşlem                      |
| -------------- | -------------------------- |
| `Ctrl + S`     | Projeyi kaydet             |
| `Ctrl + Enter` | Önizlemeyi yeni sekmede aç |

---

## 🌐 Tarayıcı Desteği

Web Playground modern web tarayıcılarında çalışacak şekilde tasarlanmıştır.

Önerilen tarayıcılar:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

---

## 🤝 Katkıda Bulunma

Katkıda bulunmak için:

### 1. Repoyu Fork Edin

GitHub üzerinden projeyi fork edin.

### 2. Yeni Branch Oluşturun

```bash
git checkout -b yeni-ozellik
```

### 3. Değişikliklerinizi Yapın

Kodunuzu geliştirin ve test edin.

### 4. Commit Oluşturun

```bash
git add .
git commit -m "Yeni özellik eklendi"
```

### 5. Branch'i Push Edin

```bash
git push origin yeni-ozellik
```

### 6. Pull Request Açın

GitHub üzerinden Pull Request oluşturun.

---

## 🐛 Bug Bildirimi

Bir hata bulduysanız GitHub Issues üzerinden bildirebilirsiniz.

Bug raporunda mümkün olduğunca şu bilgileri paylaşın:

* Tarayıcı ve versiyonu
* İşletim sistemi
* Hatanın açıklaması
* Hatayı tekrar oluşturma adımları
* Console çıktısı
* Ekran görüntüsü

---

## 💡 Feature Request

Yeni bir özellik öneriniz varsa GitHub Issues üzerinden Feature Request oluşturabilirsiniz.

Özelliğin:

* Ne yaptığını
* Neden gerekli olduğunu
* Nasıl çalışması gerektiğini
* Varsa örnek kullanımını

belirtmeniz önerilir.

---

## 📄 Lisans

Bu proje **MIT License** altında lisanslanmıştır.

Detaylar için [`LICENSE`](LICENSE) dosyasına bakabilirsiniz.

---

## 📬 İletişim

Sorularınız, önerileriniz veya hata bildirimleriniz için GitHub Issues bölümünü kullanabilirsiniz.

---

## ⭐ Projeyi Destekleyin

Web Playground işinize yaradıysa projeye ⭐ **Star** vermeyi unutmayın.

Katkılarınız ve geri bildirimleriniz projeyi geliştirmeye yardımcı olur.

---

**Keyifli kodlamalar! 🧑‍💻🚀**
