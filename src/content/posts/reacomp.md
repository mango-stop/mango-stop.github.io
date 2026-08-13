---
title: 'REACOMP: Compiling LLM Reasoning into Symbolic Solvers for Efficient Program Synthesis'
slug: REACOMP
description: 논문 리뷰
pubDate: 2026-08-12
category: paper-review
tags: []
cover: ''
draft: true
---

최근 LLM(대형 언어 모델) 기반의 **프로그램 합성(Program Synthesis)** 및 **PBE(Programming by Example)** 연구가 활발히 이어지고 있지만, 복잡한 조합적 탐색(Combinatorial Search)이 요구되는 난이도 높은 문제에서는 모델의 불확실성과 막대한 추론 비용(Test-time Compute)이 큰 걸림돌이 됩니다.

오늘 리뷰할 논문 **"REACOMP: Compiling LLM Reasoning into Symbolic Solvers for Efficient Program Synthesis"** (CMU LLab, arXiv:2605.05485)는 이 문제를 완전히 새로운 각도에서 해결합니다. 테스트 타임마다 LLM을 무겁게 호출하는 대신, **LLM의 추론 추적(Reasoning Trace)을 오프라인에서 '재사용 가능한 기호 솔버(Symbolic Solver)'로 컴파일**하여 추론 비용을 **0**으로 만들면서도 성과를 대폭 향상시키는 신경-기호(Neuro-Symbolic) 프레임워크를 제안합니다.

## 1. 연구 배경 및 문제 의식 (Motivation)

### LLM 기반 프로그램 합성의 한계

- **비효율적인 구조적 탐색:** LLM은 짧고 직관적인 코드 생성에는 강하지만, 변환 알고리즘이 길고 복잡해질수록 탐색 공간에서 갈팡질팡하며 토큰을 과도하게 소모합니다.
- **Test-time Scaling의 비용 폭발:** 문제마다 K개의 답을 생성하거나(Best-of-K) 피드백 루프(Direct Feedback)를 돌리는 방식은 성공률을 올려주지만, **테스트 시 매번 수십만 토큰의 API 비용**이 발생합니다.
- **지식의 재사용 불가능:** 동일한 패턴의 복잡한 문제를 100번 풀어도, LLM은 매번 새로운 토큰을 생성하며 똑같은 비구조적 탐색 과정을 반복합니다.

### REACOMP의 핵심 아이디어

> \*"LLM의 추론 과정을 매번 반복하지 말고, 추론 추적(Reasoning Trace)에서 반복되는 패턴과 알고리즘을 추출하여 \*\*독립적으로 동작하는 링커/컴파일러 형태의 기호 솔버(Symbolic Solver)\*_를 유도(Induction)하면 어떨까?"_

(그림 1) REACOMP의 전체 패러다임: 오프라인 솔버 유도(Offline Solver Induction) 과정과 테스트 타임에서의 하이브리드 추론(Zero-LLM Cost First) 구조

## 2. REACOMP 핵심 아키텍처 및 작동 원리

REACOMP는 크게 ① 오프라인 솔버 유도(Offline Solver Induction)와 ② 테스트 타임 하이브리드 추론(Test-time Hybrid Inference)의 2단계로 동작합니다.

(그림 2) 오프라인 단계에서 코딩 에이전트(Coding Agent)가 검증기(Verifier) 피드백을 받아 독립 실행형 Python 솔버(`SOLVER.py`)를 합성하는 상세 루프

### 1) 오프라인 솔버 유도 (Offline Solver Induction)

1. **Trace 데이터 구축:** 소량의 훈련 문제에 대해 LLM이 풀이했던 추론 기록(Reasoning Traces) 및 입출력 예시(I/O Examples)를 수집합니다.
2. **Coding Agent 기반 유도:** 코딩 에이전트(Claude Code 또는 Qwen+OpenHands 등)가 샌드박스 환경에서 추론 패턴을 분석하고, 이를 제약된 도메인 특화 언어(DSL) 기반의 기호 알고리즘으로 컴파일합니다.
3. **Verifier 루프를 통한 자가 수정:** 코딩 에이전트는 코드 검증기(Verifier)의 실행 결과를 보며 알고리즘의 오류를 디버깅하고 최적화하여, LLM 없이 동작하는 최종 파이썬 파일(`SOLVER.py`)과 명세서(`SOLVER_ALGORITHM.md`)를 도출합니다.

### 2) 테스트 타임 하이브리드 추론 (Test-time Hybrid Inference)

새로운 문제가 입력되면 시스템은 다음과 같이 단계적으로 추론합니다.

1. **Fast-path (기호 솔버 단독 실행):** 컴파일된 파이썬 기호 솔버가 즉시 답을 계산합니다. 이 단계는 **LLM 호출이 전혀 없으므로(Zero Token Cost) 속도가 빠르고 비용이 0**입니다.
2. **Slow-path (LLM Search Fallback):** 만약 기호 솔버가 풀지 못한 정교한 예외 케이스인 경우에만 LLM 기반의 탐색(Best-of-K 또는 Direct Feedback)으로 전환됩니다.

## 3. 주요 실험 결과 (Experimental Results)

논문은 프로그램 합성 최신 벤치마크인 **PBEBench** [Naik et al., 2025]와 **SLR-Bench** [Helff et al., 2025]에서 REACOMP를 평가했습니다.

(표 1) PBEBench 벤치마크에서의 단독 기호 솔버 및 하이브리드 모델 성능 비교

| 헤더1 | 헤더2 | 헤더3 |
| --- | --- | --- |
| 내용 | 내용 | 내용 |
| 내용 | 내용 | 내용 |

_(출처: REACOMP Paper, Table 1 참조)_

(그림 3) PBEBench-Hard 벤치마크에서 기존 LLM Test-time Scaling 대비 REACOMP 기호 솔버의 파레토 효율성(Pareto Efficiency) 곡선 (가로축: 토큰 소모량, 세로축: 정확도)

### 주요 핵심 결과 분석

1. **단독 기호 솔버의 우월성 (Zero LLM Cost):**

    - 유도된 기호 솔버 앙상블(Symbolic Ensemble)은 LLM 호출을 단 1회도 하지 않고도 PBEBench-Hard에서 84.7%의 정확도를 기록하여, **기존 프런티어 LLM의 Test-time Scaling 성능(68.4%)을 16.3%p 상회**했습니다.

2. **압도적인 비용 절감 효과:**

    - 하이브리드(Neuro-Symbolic) 구성 시, Hard 난이도의 정확도를 **68.4%에서 85.8%로 끌어올리면서도 토큰 사용량은 78%나 절감**했습니다.

3. **실제 도메인 전이 능력 (Zero-Shot Transfer to Linguistics):**

    - 합성된 기호 솔버를 자연어 음운 변화를 예측하는 **역사언어학(Historical Linguistics) 실전 과제**에 Zero-Shot으로 적용한 결과, **80.1%의 높은 정확도**를 기록하며 언어학적 규칙을 기호화하는 데 성공했습니다.

## 4. 깊이 있는 비판적 논의 (Critical Analysis)

(표 2) 기존 접근 방식과 REACOMP의 심층 비교

| 헤더1 | 헤더2 | 헤더3 |
| --- | --- | --- |
| 내용 | 내용 | 내용 |
| 내용 | 내용 | 내용 |

### 본 연구의 의의 (Strengths)

- **비용의 분할 상쇄(Amortization):** 초기 솔버 유도 시 소모되는 소량의 에이전트 비용은, 서비스 운영 시 수많은 Zero-Token 실행을 통해 완벽하게 상쇄됩니다.
- **AIRC / Symbolic AI의 부활:** Pure Connectionism(디프러닝 단독)의 한계를 보완하기 위해 Neuro-Symbolic 접근을 실용적·자동화된 방식으로 풀어냈습니다.

### 한계점 및 제약사항 (Limitations)

- **DSL 표현력 한계:** 오프라인 단계에서 유도하는 기호 솔버가 커버할 수 있는 Domain-Specific Language(DSL)의 범위를 벗어나는 완전히 새로운 패턴의 문제에는 약점을 보입니다.
- **오프라인 유도 단계의 비용:** 프런티어 에이전트(Claude Code 등)를 통해 기호 솔버를 만들어내는 오프라인 유도 과정 자체의 안정성과 컴퓨팅 리소스 확보가 선행되어야 합니다.

## 5. 결론 및 종합 평가

**REACOMP** 논문은 \*"LLM에게 더 많은 추론 토큰을 주어 매번 풀게 만드는 것이 과연 최선인가?"\*라는 질문에 "추론을 기호 프로그램으로 컴파일하여 재사용하라"는 명쾌한 답을 제시합니다.

단순한 코드 생성을 넘어, **LLM이 문제 해결 메커니즘을 스스로 학습하여 고성능 오픈소스 기호 컴파일러를 생성하도록 유도**했다는 점에서 향후 자동화 프로그램 합성(Automated Program Synthesis) 및 인공지능 시스템 아키텍처 연구에 큰 이정표가 될 논문입니다.

- **Official Code Repository:**[GitHub - cmu-llab/ReaComp](https://github.com/cmu-llab/ReaComp)
- **Paper Reference:** arXiv:2605.05485
