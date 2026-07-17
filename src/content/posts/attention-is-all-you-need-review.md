---
title: '[논문 리뷰] Attention Is All You Need'
description: Transformer 아키텍처를 제안한 기념비적 논문 정리 — Self-Attention의 수식과 직관
pubDate: 2026-07-15
category: paper-review
tags: [NLP, Transformer, Attention]
---

## 한 줄 요약

RNN/CNN 없이 **Attention 메커니즘만으로** 시퀀스 변환을 수행하는 Transformer 아키텍처를 제안, 병렬화와 성능 모두를 잡았다.

- 저자: Vaswani et al. (Google Brain)
- 발표: NeurIPS 2017
- [논문 링크](https://arxiv.org/abs/1706.03762)

## 핵심 아이디어: Scaled Dot-Product Attention

Attention은 Query, Key, Value 세 행렬로 계산된다:

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

여기서 $\sqrt{d_k}$로 나누는 이유는 $d_k$가 클 때 내적 값이 커져 softmax의 기울기가 소실되는 것을 막기 위함이다. 내적의 분산이 $d_k$에 비례하므로, 표준편차 $\sqrt{d_k}$로 정규화하면 분산이 $1$로 유지된다.

## Multi-Head Attention

하나의 attention 대신 $h$개의 head로 나눠 서로 다른 표현 공간을 학습한다:

$$
\mathrm{MultiHead}(Q, K, V) = \mathrm{Concat}(\mathrm{head}_1, \ldots, \mathrm{head}_h)W^O
$$

각 head는 $d_{\text{model}}/h$ 차원에서 동작하므로 전체 계산량은 single-head와 비슷하다.

## 구현 스케치

```python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(q, k, v, mask=None):
    d_k = q.size(-1)
    scores = q @ k.transpose(-2, -1) / d_k**0.5
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    return F.softmax(scores, dim=-1) @ v
```

## 내 생각

- 병렬화 관점의 이득이 이후 대규모 사전학습 시대를 연 결정적 요인이었다.
- Positional encoding이 sin/cos 함수인 이유(임의 길이 일반화)는 다시 봐도 우아하다.
- 다음에는 후속 논문인 BERT와 GPT 계열로 리뷰를 이어갈 예정.
