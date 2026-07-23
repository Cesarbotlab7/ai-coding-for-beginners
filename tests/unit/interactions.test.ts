import { describe, expect, it } from 'vitest';
import {
  assessAutomationReadiness,
  buildPrompt,
  isMemoryChoiceCorrect,
  recommendTaskSetup,
  scorePromptDraft,
} from '../../src/lib/workbuddy-labs';

describe('提示词生成器', () => {
  it('空内容得 0 分并指出所有缺项', () => {
    const result = scorePromptDraft({
      goal: '',
      input: '',
      steps: '',
      output: '',
      acceptance: '',
    });

    expect(result.score).toBe(0);
    expect(result.missing).toEqual(['目标', '素材', '步骤', '输出', '验收']);
  });

  it('完整内容得 100 分并生成可复制指令', () => {
    const draft = {
      goal: '把会议记录整理成正式会议纪要',
      input: '工作区里的 meeting-notes.txt',
      steps: '只提取明确出现的结论和待办，不自行补充',
      output: '生成 meeting-summary.md',
      acceptance: '必须包含议题、结论、负责人和截止时间',
    };

    expect(scorePromptDraft(draft)).toEqual({ score: 100, missing: [] });
    expect(buildPrompt(draft)).toContain('目标：把会议记录整理成正式会议纪要');
    expect(buildPrompt(draft)).toContain('验收标准：必须包含议题、结论、负责人和截止时间');
  });

  it('只填空格仍视为缺失', () => {
    const result = scorePromptDraft({
      goal: '   ',
      input: '\n',
      steps: '',
      output: '',
      acceptance: '',
    });

    expect(result.score).toBe(0);
  });
});

describe('任务模式与权限推荐', () => {
  it('纯问答使用 Ask 和默认权限', () => {
    expect(
      recommendTaskSetup({
        modifiesFiles: false,
        multiStep: false,
        highRisk: false,
        reversible: true,
      }),
    ).toEqual({
      workMode: 'Ask',
      permissionMode: '默认权限',
      reason: '先了解信息，不需要修改文件。',
    });
  });

  it('多步骤文件任务使用 Plan，但不会自动推荐完全访问', () => {
    expect(
      recommendTaskSetup({
        modifiesFiles: true,
        multiStep: true,
        highRisk: false,
        reversible: true,
      }),
    ).toEqual({
      workMode: 'Plan',
      permissionMode: '默认权限',
      reason: '任务会修改文件且包含多个步骤，先审查计划再执行。',
    });
  });

  it('高风险任务要求 Plan、默认权限和额外警告', () => {
    expect(
      recommendTaskSetup({
        modifiesFiles: true,
        multiStep: false,
        highRisk: true,
        reversible: false,
      }),
    ).toEqual({
      workMode: 'Plan',
      permissionMode: '默认权限',
      reason: '任务风险较高，先备份或使用副本，并逐步确认。',
    });
  });

  it('简单、可恢复的单步文件任务可以使用 Craft', () => {
    expect(
      recommendTaskSetup({
        modifiesFiles: true,
        multiStep: false,
        highRisk: false,
        reversible: true,
      }),
    ).toEqual({
      workMode: 'Craft',
      permissionMode: '默认权限',
      reason: '任务单一且可恢复，可以直接执行，但仍保留安全确认。',
    });
  });
});

describe('自动化上线检查', () => {
  it('只有手动试跑、验收和运行条件都满足时才允许开启', () => {
    expect(
      assessAutomationReadiness({
        manualRunPassed: true,
        outputVerified: true,
        absolutePath: true,
        computerAwake: true,
        clientRunning: true,
      }),
    ).toEqual({ ready: true, issues: [] });
  });

  it('一次返回所有未满足条件', () => {
    const result = assessAutomationReadiness({
      manualRunPassed: false,
      outputVerified: false,
      absolutePath: false,
      computerAwake: false,
      clientRunning: false,
    });

    expect(result.ready).toBe(false);
    expect(result.issues).toHaveLength(5);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        '先手动跑通一次任务',
        '先人工验收输出',
        '文件路径改为绝对路径',
        '关闭电脑休眠',
        '保持 WorkBuddy 运行',
      ]),
    );
  });
});

describe('记忆体检答案', () => {
  it('过期截止日期允许改写或删除，但不允许保留', () => {
    const acceptedChoices = ['edit', 'delete'];

    expect(isMemoryChoiceCorrect('edit', acceptedChoices)).toBe(true);
    expect(isMemoryChoiceCorrect('delete', acceptedChoices)).toBe(true);
    expect(isMemoryChoiceCorrect('keep', acceptedChoices)).toBe(false);
  });
});
