// ─── Skin Data ───────────────────────────────────────────────

const RARITIES = {
  consumer:   { label: 'Consumer Grade', color: '#b0c3d9', weight: 50 },
  industrial: { label: 'Industrial Grade', color: '#5e98d9', weight: 25 },
  milspec:    { label: 'Mil-Spec',        color: '#4b69ff', weight: 15 },
  restricted: { label: 'Restricted',      color: '#8847ff', weight: 6  },
  classified: { label: 'Classified',      color: '#d32ce6', weight: 3  },
  covert:     { label: 'Covert',          color: '#eb4b4b', weight: 0.8},
  gold:       { label: '★ Rare Special',  color: '#ffd700', weight: 0.2},
};

// ─── Float / Wear System ──────────────────────────────────────

const WEAR_TIERS = [
  { name: 'Factory New',    abbr: 'FN', min: 0.00, max: 0.07, color: '#4ade80', multiplier: 2.0  },
  { name: 'Minimal Wear',  abbr: 'MW', min: 0.07, max: 0.15, color: '#60a5fa', multiplier: 1.5  },
  { name: 'Field-Tested',  abbr: 'FT', min: 0.15, max: 0.38, color: '#fbbf24', multiplier: 1.0  },
  { name: 'Well-Worn',     abbr: 'WW', min: 0.38, max: 0.45, color: '#f97316', multiplier: 0.6  },
  { name: 'Battle-Scarred', abbr: 'BS', min: 0.45, max: 1.00, color: '#ef4444', multiplier: 0.3 },
];

// Weighted float distribution — FT is most common, FN is rarest
const WEAR_WEIGHTS = [
  { tier: 0, weight: 3  }, // FN  ≈ 3%
  { tier: 1, weight: 24 }, // MW  ≈ 24%
  { tier: 2, weight: 33 }, // FT  ≈ 33%
  { tier: 3, weight: 24 }, // WW  ≈ 24%
  { tier: 4, weight: 16 }, // BS  ≈ 16%
];

function rollFloat() {
  const totalWeight = WEAR_WEIGHTS.reduce((s, w) => s + w.weight, 0);
  let rand = Math.random() * totalWeight;
  let tierIdx = 2; // default FT
  for (const w of WEAR_WEIGHTS) {
    rand -= w.weight;
    if (rand <= 0) { tierIdx = w.tier; break; }
  }
  const tier = WEAR_TIERS[tierIdx];
  const float = tier.min + Math.random() * (tier.max - tier.min);
  return { float: Math.round(float * 10000) / 10000, tier };
}

function rollPattern() {
  return Math.floor(Math.random() * 1000) + 1;
}

function applyFloat(baseItem) {
  const { float, tier } = rollFloat();
  const pattern = rollPattern();
  const adjustedPrice = Math.round(baseItem.price * tier.multiplier * 100) / 100;
  return {
    ...baseItem,
    float,
    wear: tier.name,
    wearAbbr: tier.abbr,
    wearColor: tier.color,
    pattern,
    price: adjustedPrice,
    basePrice: baseItem.price,
  };
}

function floatBarHTML(float, small) {
  const pct = (float * 100).toFixed(1);
  const h = small ? 4 : 6;
  return `<div class="float-bar" style="height:${h}px">
    <div class="float-bar-segment" style="background:#4ade80;width:7%"></div>
    <div class="float-bar-segment" style="background:#60a5fa;width:8%"></div>
    <div class="float-bar-segment" style="background:#fbbf24;width:23%"></div>
    <div class="float-bar-segment" style="background:#f97316;width:7%"></div>
    <div class="float-bar-segment" style="background:#ef4444;width:55%"></div>
    <div class="float-bar-marker" style="left:${pct}%"></div>
  </div>`;
}

const S = 'https://community.akamai.steamstatic.com/economy/image/';

const CASES = [
  {
    name: 'Danger Zone Case',
    price: 2.50,
    image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3MVv_H4a6FucPPBWjDIkbdz4rg4Syyyxxsi5mzRntuvJCqVbwAgDZBwRPlK7EcZJ5GkQA',
    items: [
      { name: 'MP9 | Modest Threat', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f-jFk4uL3V6diLP-dFzfB_uJ_t-l9AXGylx4ktmqAydmrInvBOAByWcN1EOUOtxe8mtS2P-vl4FaLioJMz3ngznQehlZuXhE' },
      { name: 'Glock-18 | Oxide Blaze', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK6HLMWSf0_x5tORncCW6khUz_T_Xn9f6dnvDb1UkDsdwF7IItES6kYK1M-7k7wSI3YwQm3_63XlAvH51o7FVwJirs7M' },
      { name: 'Nova | Wood Fired', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL_kYDhwiVI0PyhfqVSKOWdGmKC_uxkpfVscCW6khUz_WiByIr8IyiXbQYlD5d1E-BftxW_lNbgMb7n7gyM3tkXnimr3C1O6n11o7FVLv86c40' },
      { name: 'M4A4 | Magnesium', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiVI0P_6afBSI_icHneV09FxuO56Wxa_nBovp3OAzo2vdHPFPFUmCJRxRbNZ4xewx9W1Nb7j4gzXg99Ayy73iC1Aun1q_a9cBiEfMG3G' },
      { name: 'Sawed-Off | Black Sand', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLin4Hl-S1d6c2tfZt-IeeWCmiWx9F0vOBqRBaglBMjjDGMnYftb3qSOAF2XpV0ELMJsUS_ldGzMO_isVHagt9Az32ojiob6Hk9sbtXB6o7uvqARF8zTjE' },
      { name: 'SG 553 | Danger Close', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLimcO1qx1c_M29b_E4c8-cGGKC_uZzsfVsSxa_nBovp3PSn4z_eH7Fb1V2DpckQeUJsRe8wNflMui0tVTX34MUyH2sjX8b7Xxu_a9cBmrf7Gwc' },
      { name: 'Tec-9 | Fubar', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLlm5W5wiVI0Oara_1SJuWRD3WvzedxuPUnGiq1xBh_4D6Bytmrcn_CaFUlX8NyR-5ZtBG7kdzgZe-z5gTb3o9NyDK-0H2rKvLQog' },
      { name: 'G3SG1 | Scavenger', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2zYXnrB1c_M2pO7dqcc-AD3GRxutJvOhuRz39xkl2tziGmNf9JX-WPQcpAsEiQOUNsBixx4bmN7nj5FHb3Y9Cyiz-hzQJsHglCU9Y5w' },
      { name: 'Galil AR | Signal', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2n5rp8SNJ0Pq3V6NsLPmfMXSZxuB3vN57Si2MmRQguynLnIqvIy-TO1UlXJMjEeAN4UGwk9DkZLnltgPYjYkTnCn6iy8buips5PFCD_QZl2QaUg' },
      { name: 'MAC-10 | Pipe Down', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1c_M2jaac8cM-WFmiv0edmtfJWQyC0nQlpt2rRwtqhdHjFa1N1A5ZxEO4MukW4lNayNrnhsVDc3YxGzir9iXkc7DErvbgEiQoeZQ' },
      { name: 'P250 | Nevermore', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwiNa0OL8PfRSJ-KSGGKUyOlxtfN6cCW6khUz_TjdmdeqdymfbVQlXpp0QuVYtBSwk9zmN-634gXd2tpCyH_2hipKunl1o7FVDpyoDiY' },
      { name: 'USP-S | Flashback', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_uh6sfJhTSiwniIrujqNjsH6dnKfbAdxAsF3ELQCu0Hsmty1N76z71GIit4RySX_2CJI6yk9tucLT-N7rUYlhjC0' },
      { name: 'UMP-45 | Momentum', rarity: 'classified', price: 18.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkk4a0qB1Y-s27ZbRSIeKBAXCD_uJ_t-l9ASzrx0txsWiBydv4JCmSaFdzDJt0TOYN5hbtwYWzNerl5QeIj4IXyX3gznQeadzF8t4' },
      { name: 'Desert Eagle | Mecha Industries', rarity: 'classified', price: 18.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk6OGRbKFsJ_yWMWqVwuZ3j-1gSCGn20h042vSyY2tdyjCZwIlXJBxQeNe4EWxxoHkMOq0sQGIid5Fnyr42HtXrnE8p4gbgvE' },
      { name: 'MP5-SD | Phosphor', rarity: 'classified', price: 18.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsPz-R1c_M2jePFSJvWAGm6GwOJJtPNgXxa_nBovp3PRzd-vdCqQOgYgCMYkRrECskLuwdfkZeqz5QKMjYwUnHj33SlI630__a9cBl0Wy4S-' },
      { name: 'AK-47 | Asiimov', rarity: 'covert', price: 50.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSIeOaB2qf19F6ueZhW2e2wEt-t2jcytf6dymSO1JxA5oiRecLsRa5kIfkYr-241aLgotHz3-rkGoXuUp8oX57' },
      { name: 'AWP | Neo-Noir', rarity: 'covert', price: 50.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6poL_6cB3WvzedxuPUnHirrxR4l423SyI39I3KXPwdxWZclQeNZ5EXskYfnNeyw71OMi9lNzDK-0H3r66pOTw' },
      { name: '★ Stiletto Knife | Fade', rarity: 'gold', price: 450.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1I-_uibbB5L8-SD1iWwOpzj-1gSCGn20h2smqHzNuqcy6TawckApJ5EeIJuxPpwNaxMejmtQLa2o5Nnnj3hy9XrnE8H9hk9aQ' },
    ]
  },
  {
    name: 'Fracture Case',
    price: 2.50,
    image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3QV7aD7OP01IfbGDzPCmbsm4LU5GnvkzUsi4WvUmIqtci_CPQNyApsjE_lK7EfrhW545A',
    items: [
      { name: 'Negev | Ultralight', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL_m5Hl6x1Y-s2gbaNoNs-GAnOCwOJ_t-l9cCW6khUz_WSAnNj_cX6VZlQlX8Z0TeVc4RG5w4ayM-2w5wzYidhGyXr-iC0f6Cl1o7FVuI8WfEM' },
      { name: 'P2000 | Gnarled', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL5lYayrXIL0PO_V7Q_cKDDMWuf0vpJp-57Qy2MmRQguynLyt38dXjDaA5zC5YlQ-Nc5BG5k93mP-jhsVeKiY8XmSr5iy5J7C1s6_FCD_TbNBDIDw' },
      { name: 'SG 553 | Ol\' Rusty', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLimcO1qx1c_M29b_E4c8-BG3SE2NF6ueZhW2e3xxt35GzSw9_8J3yePFIpCMEiRrJZukO7x4exZLiw4AGLiNgRy32rkGoXuZqsEgp2' },
      { name: 'SSG 08 | Mainframe 001', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLijZGwpR1Y-s29e6M9eM-eD26ex_x3veRWQyC0nQlptzjSntqgJS6Wbg5xDZVwTbUN5EO5ldWxYem04waP2IsUyX_5in4c6zErvbh54g-58w' },
      { name: 'P250 | Cassette', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwiFO0OL8PfRSI_GAHWKE1etJvOhuRz39lkwltT7Ww4ugc3PGOwd0DpQkQbUPshbpm93lMuy25QGIjIwUn3_72DQJsHjyHnRH0Q' },
      { name: 'P90 | Freight', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf-jFk_6v-V6diLuSSB2mV09F6ueZhW2fhk09ytjmDm4n8JHOebQEgCMAmQrEMuhi4k4W0MurntVHfid5GnC38kGoXuRB1lB54' },
      { name: 'PP-Bizon | Runic', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLzl4zv8x1c_M2sYb5iLs-bC2uc0-9_tOR7cCW6khUz_WiGm42pJXyUPwFzXJJxRrZf4xS7x4fvN7ix4gHX3o9HzX32hipBuyp1o7FVwd1bSh8' },
      { name: 'MAG-7 | Monster Call', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5G3wiFO0P-vb_NSLf-dHXOV09F1se1lcCW6khUz_WncmIz8JHmTa1JyApd5FLEMsES-kNDhM-3i5QKM2Y5AzSr9jngY6Cp1o7FV7cAHRyI' },
      { name: 'Tec-9 | Brother', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLlm5W5wiVI0Oara_1SJ-WWHG6cze9JvOhuRz39xBsj4GmEyt-vIHjEbgJ2CsR2RONfu0K_lYXvZrjg4ADYg4wXzin42DQJsHgTPX1sbQ' },
      { name: 'MAC-10 | Allure', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1Y-s2jaac8cM-aHWifz-B3j-1gSCGn209w626GnNuucC2SaFMiC8B3FuUJ5kW7wdPnZe7g7gyP2Y4Ry3_5hnlXrnE8RS4Y9Xw' },
      { name: 'Galil AR | Connexion', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2n5rp8SNJ0PW9V6NsLPmfMXeYzut4uflWQyC0nQlpt22Dzd_4cS7Db1NzDZYkQuIKsBW4xt3jPurq7gPag4oXnCqrhipB7TErvbi_0k78nw' },
      { name: 'MP5-SD | Kitbash', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsPz-R1c_M2jePF-JM-ED3SExOJ3vuVWQyy0lB4-jDGMnYftb32XZ1NyX5B5QuJcthi7k9K0Ye6zsQeP2IMRyiX4iSJLvC5q6-4HUaY7uvqAsG-atjE' },
      { name: 'M4A4 | Tooth Fairy', rarity: 'classified', price: 18.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSMeWWC2mWwOdkqd5lRi67gVN35WyDwtv8IC-RblVxCpchQLIOuhK8xNG2YbnktAXZjthFxCiohntP8G81tOVu8Qhw' },
      { name: 'Glock-18 | Vogue', rarity: 'classified', price: 18.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK8-WF2KTzuBiseJ9cCW6khUz_T-GyNavdCqRawN1CMFwTOcO5hO7loXiY-zmsQKPi44QzHj22ikcvy11o7FVfFOBmfY' },
      { name: 'XM1014 | Entombed', rarity: 'classified', price: 18.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLpk8ewrHZk7OeRcKk8cKHHMWad1OJzpN5rQzy2qhEutDWR1N-hI3yWbVRyD8YiEOVZ50TqmoKyZb7rtVfWgosQzX7-3X9K5yc4tr4cEf1yVvkijss' },
      { name: 'Desert Eagle | Printstream', rarity: 'covert', price: 50.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRbKFsJ8-DHG6e1f1iouRoQha_nBovp3OGmdeqInyVP1V0XsYlRbEI50a5wNyzZr605AyI3t5MmCSohylAuC89_a9cBoMY9UkV' },
      { name: 'AK-47 | Legion of Anubis', rarity: 'covert', price: 50.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSIf6GDG6D_uJ_t-l9AX_nzBhw4TvWwo6udC2QbgZyWcN2RuMP4xHrlYDnYezm7geP3d5FyH3gznQeY_Oe4QY' },
      { name: '★ Skeleton Knife | Crimson Web', rarity: 'gold', price: 520.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1I5PeibbBiLs-bF1iHxOxlj-1gSCGn2011t26Bytr_cn-VZwciXJskRLQKuka9k4ezYrnqtQXf2YhGzC6viXxXrnE8k9yhp-k' },
    ]
  },
  {
    name: 'Dreams & Nightmares Case',
    price: 3.00,
    image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frnIV7Kb5OaU-JqfHDzXFle0u4LY8Gy_kkRgisGzcm4v4J3vDOAQmDMdyRvlK7EcmeCU3yw',
    items: [
      { name: 'Five-SeveN | Scrawl', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3l4Dl7idN6vyRa7FSJvmFC3SV1-t4j-BlXyGyqhIqtjqEpYPwJiPTcAInA5J0FO9csBSww4bhZruzswLcjIsXmCusjCsbuno_57tXUqB386HJz1aW2pI_m5Q' },
      { name: 'MAC-10 | Ensnared', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1Y-s2jaac8cM-DB3-ZxNF6ueZhW2fikB935ziGztj7JHyQbgIkWZsmFrJY4xTpwdOzP-Oz7laNj4lFyy2tkGoXudbL5uIf' },
      { name: 'MAG-7 | Foresight', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5G3wiFO0P-vb_NSMOKWCm6T1eFkj-1gSCGn2xgmsWvRm96seXOfbFMjXJR1R-NY4xjukNLlYurn4QeN3t5CmCT7jHxXrnE8UENGXls' },
      { name: 'MP5-SD | Necro Jr.', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsPz-R1c_M2jePFSK_mXMWmVwvx5vu5kRiq8myIrujqNjsH8JXqXPVAhDZVyR7YO4ETrxtLvZbmxtAXfiIpCzHr5h3tB635j4-gCT-N7reJfmdfh' },
      { name: 'P2000 | Lifted Spirits', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL5lYayrXIL0PG7V7Q_K8-VAn6Zz-lJtPNsTiSMmRQguynLydatcHrEOgIhXJZxReINtRO7ltexZuiwtQPd34lFxXqqjisYun444fFCD_R1ajI6RQ' },
      { name: 'SCAR-20 | Poultrygeist', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLinZfyr3Jk_OKRe6dsMs-QBm6Tyut4tuhuRz2MmRQguynLno2pdnnGOw9xWcFwEbMCtkHsmoXuNe23tVGNiINCyyv6iylJuyZi5_FCD_Tlwp1EIg' },
      { name: 'Sawed-Off | Spirit Board', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLin4Hl-S1d6c2tfZt-IeeWCmiWx9F5pehjTha_nBovp3OEyN-ocCmWPwYkCpoiE-QMt0bsxNbnNLm25waK345DyST23CpP5ytp_a9cBm4mGqdG' },
      { name: 'PP-Bizon | Space Cat', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLzl4zv8x1Y-s2sYb5iLs-AHmaTxO13pN5lRi67gVN04jvcmYv6IHnGbw51XsYmQO5ftBG9xoexNrix4gPYjIJEzX_2iX9I8G81tOIzQC5J' },
      { name: 'G3SG1 | Dream Glade', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2zYXnrB1Y-s2pO7dqcc-UAmaUxNF6ueZhW2e3wkl162TVmdqvd3mUPw9yDJZ4FOYJ4UKxkNfiNrvn4QCMjdlHmHj6kGoXub9gXKkW' },
      { name: 'M4A1-S | Night Terror', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_eAMWrEwL9lj-hnXCa-mxQmjDGMnYftby3FPFVxA5ZwRecOtUXuxtPiNL_jsQLc2NkTzS38jC5L7ydj5u8EUKo7uvqAgGSM4LM' },
      { name: 'XM1014 | Zombie Offensive', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLpk8ewrHZk7v-RcKlSOv-eDG6V_uFwtuRnXCClkCIrujqNjsGqdnzEOFUjW5omROQNt0LuwNKyYeKwslfYiN0Qmyr83Hsd6iZj5esAT-N7rRccpDyZ' },
      { name: 'USP-S | Ticket to Hell', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_vp5j-lsQyWMmRQguynLzt_8JXiVOwF2AsF4R-ECshftltKxZe6x41CKjotExST8jn8f7ilr5PFCD_TZVvgG5g' },
      { name: 'Dual Berettas | Melondrama', rarity: 'classified', price: 18.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL0kp_0-B1Y-s2rZK15JeOsDGKHwPxzj-1gSCGn20t_5TiBmdf9Jy-QaQIiW5F1E-BesxG9lIaxNuLj41He340Ryi79ii5XrnE8Xl7Qhlk' },
      { name: 'FAMAS | Rapid Eye Movement', rarity: 'classified', price: 18.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3n5vh7h1c_M2oaalsM8-BD3eZxdFzqeR6cCW6khUz_WjRmN79JXmePABxDsB1QeZetxnqx9XhN-nk4A3f399CzX2qiCsa7yd1o7FVINiMH98' },
      { name: 'MP7 | Abyssal Apparition', rarity: 'classified', price: 18.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsHf_jdk4uL5V6JoIeKsAm6Xyfo45uc9GnnnzBh-5zzTw9n9I3mQPAEgD5YlFuIOthC6wNK1MeKwsgHeiZUFk3vcOiyhPQ' },
      { name: 'AK-47 | Nightwish', rarity: 'covert', price: 50.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSLvmUBnOHyP1-j-1gSCGn20glt2nXnt78cnKUbwN2XJp2R-ZbuxHqlNXlMLiw5AHc3toWnCur23hXrnE8p0T2bx4' },
      { name: 'MP9 | Starlight Protector', rarity: 'covert', price: 50.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f-jFk4uL3V7d5IeKfB2CY1dF6ueZhW2flkUtztz_SzYypJSqRalUhDJNwQO4PsBXtx9HkN-K37w3bgohGmHn3kGoXuZ3lRdvF' },
      { name: '★ Butterfly Knife | Marble Fade', rarity: 'gold', price: 900.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2qvzO9ksu1scC-ykRgYvzSCkpu3JCrBPVMkCZIiFLUC40S-l9DkZerg4Qfc3Y9DzCuo3SlK6ydv5e9UA71lpPNwsjHPzA' },
    ]
  },
  {
    name: 'Revolution Case',
    price: 2.00,
    image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frnAVvfb6aqduc_TFVjTCxbx05OU4S3jilE9w4DzRnImtIy2Sa1JzDJEhRPlK7EcO4U8gfA',
    items: [
      { name: 'MAG-7 | Insomnia', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5G3wiFO0P-vb_NSKf6AAWqeyO9JvOhuRz39wh4k4TzUnN_9cC6WO1J2DJdyROcI4BC9x9XmN-vj71eN34xAzC33hzQJsHiziLtbUA' },
      { name: 'MP9 | Featherweight', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f_jdk4uL3V7d4MPWBAm6XyfpJvOhuRz39wB9x6jncwtyvd3jBPw8gCJFwR7YItRW8kNK0P--27wLe391NzCyq3zQJsHiOu4WQDA' },
      { name: 'SCAR-20 | Fragments', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLinZfyr3Jk6OGRe6dsMs-VHGaXzOt4pPJWTSWylhYYvzSCkpu3dnmXbAZyX5pzQLQO4Ri_lIbgMOzktg2P3t8Uni32iHwc7i856r1UAL1lpPP6-FL_6g' },
      { name: 'P250 | Re.built', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwiFO0OL8PfRSMvWRG26c1dF6ueZhW2flkRh_sjjXmNb8cCnDPVUnW5ByQ-JZ5hG_xN3gZuPltAHegogWzH7-kGoXuSIylluX' },
      { name: 'MP5-SD | Liquidation', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsPz-R1Y-s2jePF-JM-CG26TytF6ufB8Ri2ygRQovQKJk4jxNWXBOgUmDsN5FrIM5xi4lIHgNe7q51Pdi4pGni-t2ntA5ids5LxRVPUj5OSJ2Kcl14st' },
      { name: 'SG 553 | Cyberforce', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLimcO1qx1Y-s29b_E4c8-QF2WV0-h5ouJscCW6khUz_Wjdntr6Iy6WbgEjA5MlRedctxG5kNKyNbi3sgTfi9oUnyj9234b5n51o7FVairOMAY' },
      { name: 'Tec-9 | Rebel', rarity: 'milspec', price: 0.50, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLlm5W5wiFO0Oara_1SJuKWC2OfzNF6ueZhW2fgkU0k5GmBzIn6eHjBagBxDZMhReYN5hC5ldbgNb7jtFbfgt5Ey3_3kGoXuRiiuNrn' },
      { name: 'M4A1-S | Emphorosaur-S', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9lj-dsSi26mxoYtS-AlJXgHifOOV5kFJt4F-8KukXtldyyMLjjtVOIjIsWzXj8iylJ5ig6tbsKV_ItqaaB3gHfcepq28_00F4' },
      { name: 'Glock-18 | Umbral Rabbit', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK8-eAWie_vx3suNgWxa_nBovp3PXyo76Ii_FPAQmDMYiTLYDthm_kdbmZry2slCLjoMQzC7_3y1J7nts_a9cBi_qumx0' },
      { name: 'MAC-10 | Sakkaku', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1Y-s2jaac8cM-AD2ybwOVjj-xsSyCmmFMk5mnRzdeqdSnCPVN2DpV3QeELtELrlIbiPrzqsVOMjdlBnySvjH5O8G81tOTP5a5f' },
      { name: 'R8 Revolver | Banana Cannon', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLjm4Dv8TRe_c2pe5t_eM-RD2mRz-9JvOhuRz39kU4msjzdmd6peXKTOFd2DcchEOEP40btlt3lN7iz5FbeiNpFzi_83zQJsHgWY2btRg' },
      { name: 'P90 | Neoqueen', rarity: 'restricted', price: 3.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf-jFk_6v-V6poL-GGC2Ke_uJ_t-l9ASyyxhl04zuDn4muInOXPAF2W5shQOAMs0G7xNfkZOuwswbej4JDnyvgznQe6S6_YqA' },
      { name: 'AWP | Duality', rarity: 'classified', price: 18.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf-jFk7uW-V6hkLfKcMXSewOVzj-1gSCGn20p_62-HnN7_cH-XblQjDZYhR-FZsETqmoXjYry2s1DX3d5AyyT62ipXrnE8bpg5yZk' },
      { name: 'UMP-45 | Wild Child', rarity: 'classified', price: 18.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkk4a0qB1Y-s27ZbRSI_yGGmSY_uV_s-pWQyC0nQlpt2iHmNyqd3KVOlB0D5YlTeZb5xjsx9PjZOjl4VCNgt1EnC77iSMf7jErvbhWyVIDbA' },
      { name: 'P2000 | Wicked Sick', rarity: 'classified', price: 18.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL5lYayrXIL0PG7V7Q_cKDDMWOVwuJ_vuRWQyC0nQlp4jnTyNqodHyXOlQkDZtzF-UN4BjukYeyZuLn5Qbaj4NEzy3_3ywd5zErvbh-3lU8Iw' },
      { name: 'M4A4 | Temukau', rarity: 'covert', price: 50.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSNPWeG2yR1NF6ueZhW2ewlBtx5W6AmYv9JS6XaAV1CJEmTeUL4UTpxNzjZO3jtgaIjN9ExCuskGoXuRnyRhBA' },
      { name: 'AK-47 | Head Shot', rarity: 'covert', price: 50.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlV6xoIfSsHW-f1dF-v-1mcCW6khUz_TzRnNigd3-SOg4lAsF1QOQN4xS4wdHnMu-0swaMjIxExSSoiyof6ih1o7FVGHIdVhw' },
      { name: '★ Kukri Knife | Fade', rarity: 'gold', price: 700.00, image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q-vm8YZtsIc-VD2OV_uJ_t-l9AXyyzEohsGvVn4moIi-VO1N2CJR1E-UD4BXtkIXhMe2x7lbej4tEnyzgznQeN9c5PgA' },
    ]
  },
];

// ─── State ────────────────────────────────────────────────────

let balance = 1000;
let inventory = [];
let selectedCase = null;
let isSpinning = false;

// ─── DOM refs ─────────────────────────────────────────────────

const balanceEl       = document.getElementById('balance');
const casesEl         = document.getElementById('cases');
const openerSection   = document.getElementById('openerSection');
const selectedNameEl  = document.getElementById('selectedCaseName');
const selectedPriceEl = document.getElementById('selectedCasePrice');
const rouletteStrip   = document.getElementById('rouletteStrip');
const openBtn         = document.getElementById('openBtn');
const backBtn         = document.getElementById('backBtn');
const wonItemEl       = document.getElementById('wonItem');
const wonItemCard     = document.getElementById('wonItemCard');
const inventoryEl     = document.getElementById('inventory');
const invValueEl      = document.getElementById('invValue');

// ─── Render Cases ─────────────────────────────────────────────

function renderCases() {
  casesEl.innerHTML = '';
  CASES.forEach((c, idx) => {
    const card = document.createElement('div');
    card.className = 'case-card';
    card.innerHTML = `
      <img class="case-icon" src="${c.image}" alt="${c.name}">
      <div class="case-name">${c.name}</div>
      <div class="case-price">$${c.price.toFixed(2)}</div>
    `;
    card.addEventListener('click', () => selectCase(idx));
    casesEl.appendChild(card);
  });
}

function selectCase(idx) {
  selectedCase = CASES[idx];
  document.querySelector('.case-select').style.display = 'none';
  openerSection.style.display = 'block';
  selectedNameEl.textContent = selectedCase.name;
  selectedPriceEl.textContent = selectedCase.price.toFixed(2);
  wonItemEl.style.display = 'none';
  rouletteStrip.innerHTML = '';
  rouletteStrip.style.transform = 'translateX(0)';
}

backBtn.addEventListener('click', () => {
  if (isSpinning) return;
  openerSection.style.display = 'none';
  document.querySelector('.case-select').style.display = 'block';
  selectedCase = null;
});

// ─── Weighted Random Pick ─────────────────────────────────────

function pickItem(caseData) {
  // Build weighted pool from the case items using their rarity weights
  const pool = [];
  caseData.items.forEach(item => {
    const w = RARITIES[item.rarity].weight;
    pool.push({ item, weight: w });
  });

  // Normalize: sum up all weights, pick randomly
  const totalWeight = pool.reduce((sum, p) => sum + p.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const p of pool) {
    rand -= p.weight;
    if (rand <= 0) return p.item;
  }
  return pool[pool.length - 1].item;
}

// ─── Build Roulette Strip ─────────────────────────────────────

function buildStrip(winItem) {
  const ITEM_WIDTH = 140;
  const TOTAL_ITEMS = 70;
  const WIN_INDEX = 55; // where the winning item sits

  rouletteStrip.innerHTML = '';
  rouletteStrip.classList.remove('spinning');
  rouletteStrip.style.transform = 'translateX(0)';

  for (let i = 0; i < TOTAL_ITEMS; i++) {
    let item;
    if (i === WIN_INDEX) {
      item = winItem;
    } else {
      item = applyFloat(pickItem(selectedCase));
    }

    const el = document.createElement('div');
    el.className = `roulette-item rarity-${item.rarity}`;
    el.innerHTML = `
      <img class="item-icon" src="${item.image}" alt="${item.name}">
      <div class="item-name">${item.name}</div>
      <div class="item-wear" style="color:${item.wearColor}">${item.wearAbbr}</div>
    `;
    rouletteStrip.appendChild(el);
  }

  return { ITEM_WIDTH, WIN_INDEX };
}

// ─── Open Case ────────────────────────────────────────────────

openBtn.addEventListener('click', () => {
  if (isSpinning || !selectedCase) return;
  if (balance < selectedCase.price) {
    alert('Not enough balance!');
    return;
  }

  isSpinning = true;
  openBtn.disabled = true;
  wonItemEl.style.display = 'none';

  balance -= selectedCase.price;
  updateBalance();

  const winItem = applyFloat(pickItem(selectedCase));
  const { ITEM_WIDTH, WIN_INDEX } = buildStrip(winItem);

  // Calculate offset: center the winning item under the marker
  const containerWidth = document.querySelector('.roulette-container').offsetWidth;
  const centerOffset = containerWidth / 2 - ITEM_WIDTH / 2;
  // Add a small random offset within the item so it doesn't always land dead center
  const randomNudge = (Math.random() - 0.5) * (ITEM_WIDTH * 0.6);
  const targetX = -(WIN_INDEX * ITEM_WIDTH) + centerOffset + randomNudge;

  // Spin duration
  const duration = 5000 + Math.random() * 1500;

  // Force reflow then animate
  void rouletteStrip.offsetHeight;
  rouletteStrip.classList.add('spinning');
  rouletteStrip.style.transitionDuration = `${duration}ms`;
  rouletteStrip.style.transform = `translateX(${targetX}px)`;

  // Play tick sounds during spin
  playTicksDuring(duration);

  setTimeout(() => {
    isSpinning = false;
    openBtn.disabled = false;
    rouletteStrip.classList.remove('spinning');

    // Show result
    wonItemEl.style.display = 'block';
    wonItemCard.className = `won-item-card rarity-${winItem.rarity}`;
    wonItemCard.innerHTML = `
      <img class="item-icon" src="${winItem.image}" alt="${winItem.name}">
      <div class="item-name" style="color:${RARITIES[winItem.rarity].color}">${winItem.name}</div>
      <div class="won-wear" style="color:${winItem.wearColor}">${winItem.wear}</div>
      ${floatBarHTML(winItem.float, false)}
      <div class="won-details">
        <span>Float: ${winItem.float.toFixed(4)}</span>
        <span>Pattern: #${winItem.pattern}</span>
      </div>
      <div class="item-price" style="color:${RARITIES[winItem.rarity].color}">$${winItem.price.toFixed(2)}</div>
      <div style="color:#64748b;font-size:0.7rem;margin-top:2px">${RARITIES[winItem.rarity].label}</div>
    `;

    // Add to inventory
    inventory.push(winItem);
    renderInventory();
  }, duration + 200);
});

// ─── Audio Ticks (Web Audio API) ──────────────────────────────

let audioCtx = null;

function playTick() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 800 + Math.random() * 400;
  gain.gain.value = 0.08;
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}

function playTicksDuring(duration) {
  const startTime = performance.now();
  let tickInterval = 30;

  function tick() {
    const elapsed = performance.now() - startTime;
    if (elapsed > duration - 300) return;

    playTick();

    // Slow down ticks as spin decelerates
    const progress = elapsed / duration;
    tickInterval = 30 + progress * 250;
    setTimeout(tick, tickInterval);
  }
  tick();
}

// ─── Balance & Inventory ──────────────────────────────────────

function updateBalance() {
  balanceEl.textContent = balance.toFixed(2);
}

function renderInventory() {
  inventoryEl.innerHTML = '';
  if (inventory.length === 0) {
    inventoryEl.innerHTML = '<div class="inventory-empty">Your inventory is empty. Open some cases!</div>';
    invValueEl.textContent = '0.00';
    return;
  }

  const totalValue = inventory.reduce((s, i) => s + (i.price || 0), 0);
  invValueEl.textContent = totalValue.toFixed(2);

  // Show newest first
  [...inventory].reverse().forEach((item, displayIdx) => {
    const realIdx = inventory.length - 1 - displayIdx;
    const el = document.createElement('div');
    el.className = `inv-item rarity-${item.rarity}`;
    el.innerHTML = `
      <img class="item-icon" src="${item.image}" alt="${item.name}">
      <div class="item-name" style="color:${RARITIES[item.rarity].color}">${item.name}</div>
      <div class="inv-wear" style="color:${item.wearColor}">${item.wearAbbr} · ${item.float.toFixed(4)}</div>
      ${floatBarHTML(item.float, true)}
      <div class="inv-pattern">Pattern #${item.pattern}</div>
      <div class="item-price">$${item.price.toFixed(2)}</div>
      <button class="sell-btn">SELL</button>
    `;
    el.querySelector('.sell-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      sellItem(realIdx);
    });
    inventoryEl.appendChild(el);
  });
}

function sellItem(idx) {
  const item = inventory[idx];
  balance += item.price;
  updateBalance();
  inventory.splice(idx, 1);
  renderInventory();
}

// ─── Init ─────────────────────────────────────────────────────

renderCases();
renderInventory();
