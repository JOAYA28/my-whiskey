# \# 🎨 \[디자인 가이드] 내 입맛에 맞는 위스키

# 

# \## 1. 디자인 컨셉

# 

# \### 컨셉

# 

# \*\*"Find Your Dram"\*\*

# 

# 위스키를 판매하는 서비스가 아니라, 사용자의 취향을 발견하는 프리미엄 경험을 제공합니다.

# 

# 전체적인 분위기는 \*\*Aesop, Tamburins, Nonfiction, Apple\*\*과 같은 미니멀한 라이프스타일 브랜드를 참고합니다.

# 

# 과도한 위스키 바(Bar) 느낌이나 빈티지 스타일은 지양하고, 따뜻하고 세련된 감성을 중심으로 디자인합니다.

# 

# \---

# 

# \## 2. Tone \& Mood

# 

# \* Premium

# \* Warm

# \* Minimal

# \* Modern

# \* Elegant

# \* Quiet Luxury

# \* Lifestyle

# \* Editorial

# 

# 사용자가 "테스트"를 하는 느낌보다 \*\*향을 탐험하는 여정(Journey)\*\* 을 경험하도록 디자인합니다.

# 

# \---

# 

# \## 3. Color Palette

# 

# \### Background

# 

# ```css

# \#F7F3ED

# ```

# 

# 따뜻한 아이보리

# 

# \---

# 

# \### Surface

# 

# ```css

# \#FFFDF9

# ```

# 

# 카드 배경

# 

# \---

# 

# \### Primary

# 

# ```css

# \#3C2F2F

# ```

# 

# 다크 브라운

# 

# \---

# 

# \### Secondary

# 

# ```css

# \#7A5C3E

# ```

# 

# 우드 브라운

# 

# \---

# 

# \### Accent

# 

# ```css

# \#C89B3C

# ```

# 

# Amber Gold

# 

# CTA 버튼, 진행바 등에만 사용

# 

# \---

# 

# \### Text

# 

# ```css

# \#2A2A2A

# ```

# 

# 거의 검정

# 

# \---

# 

# \### Border

# 

# ```css

# \#E7DED3

# ```

# 

# 얇은 구분선

# 

# \---

# 

# \## 4. Typography

# 

# 느긋하고 고급스러운 인상을 주는 타이포그래피

# 

# 제목은 여백을 넓게 사용하고, 본문은 읽기 쉬운 크기로 구성합니다.

# 

# 너무 귀엽거나 게임 같은 폰트는 사용하지 않습니다.

# 

# \---

# 

# \## 5. Component Style (Tailwind CSS)

# 

# \### Layout

# 

# \* Mobile First

# \* max-w-md

# \* mx-auto

# \* px-6

# \* py-8

# 

# \---

# 

# \### Card

# 

# ```css

# rounded-3xl

# 

# shadow-lg

# 

# border border-\[#E7DED3]

# 

# bg-\[#FFFDF9]

# ```

# 

# \---

# 

# \### Button

# 

# ```css

# rounded-full

# 

# bg-\[#3C2F2F]

# 

# text-white

# 

# hover:bg-\[#2A211F]

# 

# transition-all

# 

# duration-300

# 

# hover:scale-105

# ```

# 

# \---

# 

# \### Progress Bar

# 

# 배경

# 

# ```css

# bg-stone-200

# ```

# 

# 진행률

# 

# ```css

# bg-\[#C89B3C]

# 

# transition-all

# 

# duration-500

# ```

# 

# \---

# 

# \### Choice Button

# 

# 선택 전

# 

# ```css

# bg-white

# 

# border

# 

# border-stone-300

# ```

# 

# 선택 후

# 

# ```css

# bg-\[#3C2F2F]

# 

# text-white

# 

# border-\[#3C2F2F]

# ```

# 

# \---

# 

# \## 6. UI Mood

# 

# 전체적으로 여백을 넉넉하게 사용합니다.

# 

# 한 화면에는 하나의 질문만 보여주어 사용자가 충분히 생각하고 선택할 수 있도록 합니다.

# 

# 질문 전환은 부드러운 Fade와 Slide 애니메이션을 적용합니다.

# 

# \---

# 

# \## 7. Result Page

# 

# 결과 화면은 단순히 위스키 이름만 보여주는 것이 아니라 \*\*'나의 취향 카드'\*\* 를 제공하는 형태로 구성합니다.

# 

# 예시

# 

# 🥃 당신의 취향

# 

# "부드러운 달콤함 속에 은은한 스파이스를 즐기는 타입"

# 

# 추천 위스키

# 

# \* Glenmorangie Original

# \* Balvenie DoubleWood 12

# \* Glenlivet 12

# 

# 향미 프로파일은 레이더 차트 또는 태그 형태로 시각화합니다.

# 

# \* 🍯 Honey

# \* 🍎 Fruity

# \* 🌿 Herbal

# \* 🌸 Floral

# 

# 하단에는 추천 이유와 함께 "오늘의 음식 페어링", "비슷한 스타일의 위스키"를 함께 제공합니다.

# 

# \---

# 

# \## 8. Animation

# 

# \* Fade In

# \* Slide Up

# \* Progress Animation

# \* Hover Scale

# \* Button Ripple

# 

# 과도한 모션은 지양하고, 부드럽고 자연스러운 인터랙션을 중심으로 구현합니다.

# 

# \---

# 

# \## 9. 참고 키워드

# 

# Aesop

# 

# Tamburins

# 

# Nonfiction

# 

# Apple

# 

# MUJI

# 

# Editorial Design

# 

# Luxury Lifestyle

# 

# Whisky Tasting Notebook

# 

# Quiet Luxury



