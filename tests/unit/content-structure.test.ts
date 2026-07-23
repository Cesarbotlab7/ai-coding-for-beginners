import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CURRICULUM } from '../../src/lib/curriculum';

const chaptersDirectory = resolve(process.cwd(), 'content/chapters');
const homePageSource = readFileSync(resolve(process.cwd(), 'src/pages/index.astro'), 'utf8');
const chapterPageSource = readFileSync(
  resolve(process.cwd(), 'src/pages/chapter/[slug].astro'),
  'utf8',
);
const highFidelityLabs = [
  'ModePermissionLab.astro',
  'InterfaceMapLab.astro',
  'FirstTaskLab.astro',
  'ArtifactAcceptanceLab.astro',
].map((fileName) => ({
  fileName,
  source: readFileSync(
    resolve(process.cwd(), 'src/components/workbuddy', fileName),
    'utf8',
  ),
}));

function readScalar(frontmatter: string, key: string) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, 'm'));
  return match?.[1].trim();
}

function readChapterFiles() {
  return readdirSync(chaptersDirectory)
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const source = readFileSync(resolve(chaptersDirectory, fileName), 'utf8');
      const frontmatter = source.match(/^---\n([\s\S]+?)\n---/)?.[1] ?? '';
      return {
        fileName,
        source,
        slug: readScalar(frontmatter, 'slug'),
        order: Number(readScalar(frontmatter, 'order')),
        stage: Number(readScalar(frontmatter, 'stage')),
        coreComponent: readScalar(frontmatter, 'core_component'),
        verified: readScalar(frontmatter, 'verified'),
        verifiedVersion: readScalar(frontmatter, 'verified_version'),
        hasSources: /^sources:\s*$/m.test(frontmatter),
        hasTakeaways: /^takeaways:\s*$/m.test(frontmatter),
      };
    })
    .sort((a, b) => a.order - b.order);
}

describe('章节内容结构', () => {
  const chapters = readChapterFiles();

  it('只包含课程 SSOT 定义的 11 个章节', () => {
    expect(chapters).toHaveLength(CURRICULUM.length);
    expect(chapters.map((chapter) => chapter.slug)).toEqual(
      CURRICULUM.map((lesson) => lesson.slug),
    );
  });

  it('顺序和阶段与课程 SSOT 一致', () => {
    expect(
      chapters.map(({ slug, order, stage }) => ({ slug, order, stage })),
    ).toEqual(CURRICULUM);
  });

  it('每章都有一个核心交互、核验版本、来源和收尾要点', () => {
    for (const chapter of chapters) {
      expect(chapter.coreComponent, chapter.fileName).toBeTruthy();
      expect(chapter.verified, chapter.fileName).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(chapter.verifiedVersion, chapter.fileName).toBeTruthy();
      expect(chapter.hasSources, chapter.fileName).toBe(true);
      expect(chapter.hasTakeaways, chapter.fileName).toBe(true);

      const componentTag = `<${chapter.coreComponent} />`;
      expect(
        chapter.source.split(componentTag).length - 1,
        `${chapter.fileName} 应恰好包含一次 ${componentTag}`,
      ).toBe(1);
    }
  });

  it('来源只保留为内部元数据，不在首页和章节页公开展示', () => {
    expect(homePageSource).not.toContain('教程不是照搬一篇文章');
    expect(homePageSource).not.toContain('source-note');
    expect(chapterPageSource).not.toContain('本单元来源');
    expect(chapterPageSource).not.toContain('lesson-sources');
  });

  it('关键练习都复用当前版本的高保真 WorkBuddy 外壳', () => {
    for (const lab of highFidelityLabs) {
      expect(lab.source, lab.fileName).toContain(
        "import WorkBuddyShell from './WorkBuddyShell.astro';",
      );
      expect(lab.source, lab.fileName).toContain('<WorkBuddyShell');
      expect(lab.source, lab.fileName).not.toContain('教学用简化界面');
    }
  });
});
