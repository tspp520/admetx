from lib_normalize import canonicalize, clean_frame


def test_canonicalize_valid():
    assert canonicalize("C(C)O") == "CCO"


def test_canonicalize_invalid_returns_none():
    assert canonicalize("not_a_smiles") is None


def test_canonicalize_empty_returns_none():
    assert canonicalize("") is None


def test_clean_frame_dedup_and_drop_invalid():
    rows = [("CCO", 1.0), ("C(C)O", 2.0), ("xx", 3.0)]  # 第2个与第1个等价(重复), 第3个非法
    out, rate = clean_frame(rows)
    assert len(out) == 1 and out[0][0] == "CCO"
    # 3 行里 2 行可解析 -> 解析率 2/3
    assert abs(rate - 2 / 3) < 1e-6


def test_clean_frame_empty():
    out, rate = clean_frame([])
    assert out == [] and rate == 0.0
