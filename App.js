import { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const COLORS = {
  background: '#100E20',
  backgroundTop: '#211944',
  surface: '#211E37',
  surfaceLight: '#302B4B',
  ink: '#FFFFFF',
  muted: '#A5A1B8',
  purple: '#8368FF',
  purpleLight: '#AA93FF',
  pink: '#D74FB8',
  cyan: '#41C7D3',
  green: '#45D499',
  yellow: '#F7C85C',
  line: '#39344E',
};

const HABITS = [
  {
    id: 'focus',
    icon: '🎯',
    title: 'Sesi fokus',
    detail: 'Belajar tanpa distraksi, minimal 25 menit',
    category: 'Fokus',
  },
  {
    id: 'water',
    icon: '💧',
    title: 'Minum air',
    detail: 'Jaga energi dengan minum air putih',
    category: 'Sehat',
  },
  {
    id: 'pause',
    icon: '🌿',
    title: 'Jeda sejenak',
    detail: 'Tarik napas dan istirahat dari layar',
    category: 'Sehat',
  },
];

const STAR_POSITIONS = [
  { left: '7%', top: '8%', size: 3 },
  { left: '18%', top: '16%', size: 2 },
  { left: '83%', top: '7%', size: 3 },
  { left: '72%', top: '19%', size: 2 },
  { left: '92%', top: '27%', size: 3 },
  { left: '12%', top: '32%', size: 2 },
  { left: '57%', top: '30%', size: 3 },
  { left: '31%', top: '39%', size: 2 },
  { left: '78%', top: '44%', size: 3 },
  { left: '8%', top: '52%', size: 2 },
  { left: '44%', top: '57%', size: 3 },
  { left: '88%', top: '63%', size: 2 },
  { left: '22%', top: '68%', size: 3 },
  { left: '63%', top: '74%', size: 2 },
  { left: '5%', top: '82%', size: 3 },
  { left: '80%', top: '88%', size: 2 },
  { left: '35%', top: '92%', size: 3 },
  { left: '70%', top: '13%', shooting: true },
  { left: '9%', top: '42%', shooting: true },
  { left: '85%', top: '73%', shooting: true },
];

function StarField() {
  const [animations] = useState(() => STAR_POSITIONS.map(() => new Animated.Value(0)));

  useEffect(() => {
    const loops = animations.map((value, index) => {
      const shooting = STAR_POSITIONS[index].shooting;
      const animation = shooting
        ? Animated.loop(
            Animated.sequence([
              Animated.delay((index - 17) * 2600),
              Animated.timing(value, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: Platform.OS !== 'web',
              }),
              Animated.timing(value, {
                toValue: 0,
                duration: 0,
                useNativeDriver: Platform.OS !== 'web',
              }),
            ]),
          )
        : Animated.loop(
            Animated.sequence([
              Animated.delay(index * 190),
              Animated.timing(value, {
                toValue: 1,
                duration: 1500 + (index % 4) * 350,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: Platform.OS !== 'web',
              }),
              Animated.timing(value, {
                toValue: 0,
                duration: 1500 + (index % 3) * 300,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: Platform.OS !== 'web',
              }),
            ]),
          );
      animation.start();
      return animation;
    });

    return () => loops.forEach((animation) => animation.stop());
  }, [animations]);

  return (
    <View pointerEvents="none" style={styles.starField}>
      {STAR_POSITIONS.map((star, index) => {
        const progress = animations[index];
        const opacity = progress.interpolate({
          inputRange: [0, 0.45, 1],
          outputRange: star.shooting ? [0, 0.95, 0] : [0.4, 1, 0.4],
        });
        const movement = star.shooting
          ? {
              translateX: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [-25, 55],
              }),
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -42],
              }),
            }
          : {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -16 - (index % 3) * 7],
              }),
              scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.35] }),
            };

        return (
          <Animated.View
            key={`star-${index}`}
            style={[
              styles.star,
              star.shooting ? styles.shootingStar : null,
              {
                left: star.left,
                top: star.top,
                width: star.shooting ? 36 : star.size + 1,
                height: star.shooting ? 2 : star.size + 1,
                opacity,
                transform: [
                  ...Object.entries(movement).map(([key, value]) => ({ [key]: value })),
                  ...(star.shooting ? [{ rotate: '-35deg' }] : []),
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

function PageHeading({ eyebrow, title, description }) {
  return (
    <View style={styles.pageHeading}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.pageTitle}>{title}</Text>
      {description ? <Text style={styles.pageDescription}>{description}</Text> : null}
    </View>
  );
}

function ProgressCard({ completed, total, onOpenJournal }) {
  const progress = total === 0 ? 0 : completed / total;
  const percent = Math.round(progress * 100);

  return (
    <View style={styles.progressCard}>
      <View style={styles.progressTextGroup}>
        <Text style={styles.progressEyebrow}>✨  PERJALANANMU HARI INI</Text>
        <Text style={styles.progressTitle}>
          {completed === total ? 'Hari yang luar biasa!' : 'Kamu sedang bertumbuh'}
        </Text>
        <Text style={styles.progressCaption}>
          {completed} dari {total} ritual kecil sudah kamu lakukan
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%` }]} />
      </View>
      <View style={styles.progressFooter}>
        <Text style={styles.progressPercent}>⚡ {percent}% tercapai</Text>
        <Pressable onPress={onOpenJournal} accessibilityRole="button">
          <Text style={styles.progressLink}>Lihat refleksi  ›</Text>
        </Pressable>
      </View>
      <View style={styles.progressOrb} />
      <View style={styles.progressOrbSmall} />
    </View>
  );
}

function HabitCard({ habit, completed, onToggle }) {
  return (
    <View style={[styles.habitCard, completed && styles.habitCardDone]}>
      <View style={styles.habitIcon}>
        <Text style={styles.habitEmoji}>{habit.icon}</Text>
      </View>
      <View style={styles.habitCopy}>
        <Text style={styles.habitTitle}>{habit.title}</Text>
        <Text style={styles.habitDetail}>{habit.detail}</Text>
      </View>
      <Pressable
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completed }}
        accessibilityLabel={`${habit.title}, ${completed ? 'selesai' : 'belum selesai'}`}
        style={[styles.checkButton, completed && styles.checkButtonDone]}
      >
        <Text style={[styles.checkMark, completed && styles.checkMarkDone]}>
          {completed ? '✓' : '+'}
        </Text>
      </Pressable>
    </View>
  );
}

function BottomNavigation({ activeTab, onNavigate }) {
  const tabs = [
    { id: 'home', icon: '⌂', label: 'Beranda' },
    { id: 'journal', icon: '▤', label: 'Jurnal' },
    { id: 'profile', icon: '♙', label: 'Profil' },
  ];

  return (
    <View style={styles.bottomBar}>
      {tabs.map((tab) => {
        const selected = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            style={styles.tabButton}
            onPress={() => onNavigate(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <View style={[styles.tabIconWrap, selected && styles.tabIconWrapSelected]}>
              <Text style={[styles.tabIcon, selected && styles.tabSelected]}>{tab.icon}</Text>
            </View>
            {selected ? <Text style={[styles.tabLabel, styles.tabSelected]}>{tab.label}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function HomeScreen({ now, habits, completedCount, journalEntry, onToggleHabit, onNavigate }) {
  const [selectedFilter, setSelectedFilter] = useState('Semua');
  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(now),
    [now],
  );
  const greeting =
    now.getHours() < 11 ? 'Selamat pagi' : now.getHours() < 15 ? 'Selamat siang' : 'Selamat sore';
  const visibleHabits =
    selectedFilter === 'Semua'
      ? habits
      : habits.filter((habit) => habit.category === selectedFilter);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.homeTopline}>
        <View style={styles.identity}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarSmallText}>🌱</Text>
            </View>
          </View>
          <View style={styles.identityCopy}>
            <Text style={styles.dateText}>{greeting}</Text>
            <Text style={styles.greeting}>Teman Bertumbuh</Text>
            <View style={styles.levelRow}>
              <Text style={styles.levelBadge}>LV. 01</Text>
              <Text style={styles.rankBadge}>Ruang positif</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Buka refleksi"
            style={styles.headerAction}
            onPress={() => onNavigate('journal')}
          >
            <Text style={styles.headerActionIcon}>♧</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Buka profil"
            style={styles.headerAction}
            onPress={() => onNavigate('profile')}
          >
            <Text style={styles.headerActionIcon}>⌕</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.shortcutRow}
      >
        {[
          { label: 'Ritual', tab: 'home' },
          { label: 'Refleksi', tab: 'journal' },
          { label: 'Perjalanan', tab: 'profile' },
          { label: 'Tentang', tab: 'profile' },
        ].map((item) => (
          <Pressable
            key={item.label}
            style={[styles.shortcutChip, item.tab === 'home' && styles.shortcutChipActive]}
            onPress={() => onNavigate(item.tab)}
          >
            <Text style={[styles.shortcutText, item.tab === 'home' && styles.shortcutTextActive]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable style={styles.moodBanner} onPress={() => onNavigate('journal')}>
        <Text style={styles.moodBannerIcon}>✦</Text>
        <Text style={styles.moodBannerText}>RUANG KECIL UNTUK TUMBUH LEBIH BAIK</Text>
        <Text style={styles.moodBannerArrow}>›</Text>
      </Pressable>

      <ProgressCard
        completed={completedCount}
        total={habits.length}
        onOpenJournal={() => onNavigate('journal')}
      />

      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.sectionTitle}>Ritual hari ini</Text>
          <Text style={styles.sectionSubtitle}>{dateLabel} · pilih yang sudah dilakukan</Text>
        </View>
        <Text style={styles.counterPill}>{completedCount}/{habits.length}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {['Semua', 'Fokus', 'Sehat'].map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setSelectedFilter(filter)}
            style={[styles.filterChip, selectedFilter === filter && styles.filterChipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedFilter === filter }}
          >
            <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
              {filter === 'Semua' ? 'Semua ritual' : filter}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.habitList}>
        {visibleHabits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            completed={habit.done}
            onToggle={() => onToggleHabit(habit.id)}
          />
        ))}
      </View>

      <View style={styles.communityStrip}>
        <View style={styles.communityMark}>
          <Text style={styles.communityMarkText}>✦</Text>
        </View>
        <View style={styles.communityCopy}>
          <Text style={styles.communityTitle}>Setiap langkah berarti</Text>
          <Text style={styles.communityText}>Kamu sudah menyelesaikan {completedCount} ritual hari ini</Text>
        </View>
        <Text style={styles.communityArrow}>›</Text>
      </View>

      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.sectionTitle}>Tempat bertumbuh</Text>
          <Text style={styles.sectionSubtitle}>Rawat pikiran dan tubuhmu</Text>
        </View>
        <Text style={styles.sectionMore}>Lihat ide  ›</Text>
      </View>
      <View style={styles.featureRow}>
        <Pressable style={styles.featureCardFocus} onPress={() => setSelectedFilter('Fokus')}>
          <Text style={styles.featureIcon}>🎧</Text>
          <Text style={styles.featureTitle}>Waktu fokus</Text>
          <Text style={styles.featureCaption}>Belajar dengan tenang</Text>
          <View style={styles.featureDotRow}>
            <View style={styles.liveDot} />
            <Text style={styles.featureLive}>Lihat ritual fokus</Text>
          </View>
        </Pressable>
        <Pressable style={styles.featureCardJournal} onPress={() => onNavigate('journal')}>
          <Text style={styles.featureIcon}>🌙</Text>
          <Text style={styles.featureTitle}>Jurnal syukur</Text>
          <Text style={styles.featureCaption}>Catat hal baikmu</Text>
          <View style={styles.featureDotRow}>
            <View style={styles.liveDot} />
            <Text style={styles.featureLive}>Satu menit untuk diri</Text>
          </View>
        </Pressable>
      </View>

      <Pressable style={styles.journalTeaser} onPress={() => onNavigate('journal')}>
        <View style={styles.teaserIcon}>
          <Text style={styles.teaserEmoji}>✍️</Text>
        </View>
        <View style={styles.teaserCopy}>
          <Text style={styles.teaserTitle}>
            {journalEntry ? 'Catatanmu hari ini' : 'Apa hal baik hari ini?'}
          </Text>
          <Text style={styles.teaserText} numberOfLines={2}>
            {journalEntry || 'Simpan satu hal kecil yang ingin kamu syukuri.'}
          </Text>
        </View>
        <Text style={styles.teaserArrow}>›</Text>
      </Pressable>
      <Text style={styles.encouragement}>Pelan-pelan juga tetap maju. ✦</Text>
    </ScrollView>
  );
}

function JournalScreen({ entry, onSave }) {
  const [draft, setDraft] = useState(entry);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const savedEntry = draft.trim();
    onSave(savedEntry);
    setDraft(savedEntry);
    setSaved(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <PageHeading
        eyebrow="RUANG REFLEKSI"
        title="Jurnal syukur"
        description="Luangkan satu menit untuk merayakan hal baik yang terjadi hari ini."
      />
      <View style={styles.promptCard}>
        <Text style={styles.promptIcon}>🌼</Text>
        <Text style={styles.promptText}>Apa satu hal kecil yang membuatmu tersenyum hari ini?</Text>
      </View>
      <Text style={styles.inputLabel}>CERITAKAN DI SINI</Text>
      <TextInput
        value={draft}
        onChangeText={(text) => {
          setDraft(text);
          setSaved(false);
        }}
        placeholder="Contoh: akhirnya paham materi yang kupelajari..."
        placeholderTextColor="#A0AAA4"
        multiline
        textAlignVertical="top"
        maxLength={500}
        style={styles.journalInput}
        accessibilityLabel="Catatan jurnal syukur"
      />
      <Text style={styles.characterCount}>{draft.length}/500 karakter</Text>
      <Pressable
        onPress={handleSave}
        disabled={!draft.trim()}
        style={[styles.primaryButton, !draft.trim() && styles.primaryButtonDisabled]}
        accessibilityRole="button"
      >
        <Text style={styles.primaryButtonText}>Simpan refleksi</Text>
        <Text style={styles.primaryButtonArrow}>→</Text>
      </Pressable>
      {saved ? (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>Tersimpan. Terima kasih sudah memberi ruang untuk diri sendiri! ✨</Text>
        </View>
      ) : null}
      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>Ingat, tidak harus sempurna</Text>
        <Text style={styles.tipText}>
          Refleksi singkat membantu kita melihat bahwa kemajuan sering hadir dalam hal-hal sederhana.
        </Text>
      </View>
    </ScrollView>
  );
}

function ProfileScreen({ completedCount, totalHabits, journalEntry, onNavigate }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <PageHeading
        eyebrow="TENTANG PERJALANANMU"
        title="Profil bertumbuh"
        description="Kebiasaan baik dibangun satu hari pada satu waktu."
      />
      <View style={styles.profileCard}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>🌱</Text>
        </View>
        <Text style={styles.profileName}>Teman Bertumbuh</Text>
        <Text style={styles.profileCaption}>Sedang merawat versi terbaik diri sendiri</Text>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedCount}/{totalHabits}</Text>
          <Text style={styles.statLabel}>Ritual hari ini</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{journalEntry ? '1' : '0'}</Text>
          <Text style={styles.statLabel}>Refleksi tersimpan</Text>
        </View>
      </View>
      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>Tentang RuangTumbuh</Text>
        <Text style={styles.aboutText}>
          Teman sederhana untuk membangun rutinitas yang lebih seimbang: fokus belajar, minum air,
          beristirahat, dan menghargai kemajuan diri.
        </Text>
        <View style={styles.divider} />
        <Text style={styles.aboutFooter}>Dibuat dengan niat baik untuk bertumbuh bersama. 🌿</Text>
      </View>
      <Pressable style={styles.secondaryButton} onPress={() => onNavigate('home')}>
        <Text style={styles.secondaryButtonText}>Kembali ke ritual hari ini</Text>
      </Pressable>
    </ScrollView>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [now, setNow] = useState(() => new Date());
  const [habits, setHabits] = useState(() =>
    HABITS.map((habit) => ({ ...habit, done: habit.id === 'water' })),
  );
  const [journalEntry, setJournalEntry] = useState('');
  const completedCount = habits.filter((habit) => habit.done).length;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const toggleHabit = (id) => {
    setHabits((currentHabits) =>
      currentHabits.map((habit) =>
        habit.id === id ? { ...habit, done: !habit.done } : habit,
      ),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.appShell}>
        <StarField />
        {activeTab === 'home' ? (
          <HomeScreen
            now={now}
            habits={habits}
            completedCount={completedCount}
            journalEntry={journalEntry}
            onToggleHabit={toggleHabit}
            onNavigate={setActiveTab}
          />
        ) : activeTab === 'journal' ? (
          <JournalScreen entry={journalEntry} onSave={setJournalEntry} />
        ) : (
          <ProfileScreen
            completedCount={completedCount}
            totalHabits={habits.length}
            journalEntry={journalEntry}
            onNavigate={setActiveTab}
          />
        )}
        <BottomNavigation activeTab={activeTab} onNavigate={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  appShell: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    backgroundColor: COLORS.background,
  },
  starField: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.background,
  },
  star: {
    position: 'absolute',
    borderRadius: 3,
    backgroundColor: '#E8E1FF',
    shadowColor: '#C4B4FF',
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 2,
  },
  shootingStar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    shadowColor: COLORS.purpleLight,
    shadowOpacity: 1,
    shadowRadius: 7,
    elevation: 4,
  },
  scrollContent: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 28 },
  homeTopline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 17,
  },
  identity: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    padding: 3,
    backgroundColor: COLORS.purple,
    shadowColor: COLORS.purple,
    shadowOpacity: 0.45,
    shadowRadius: 9,
    elevation: 5,
  },
  avatarSmall: {
    flex: 1,
    borderRadius: 26,
    backgroundColor: '#302747',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmallText: { color: COLORS.purpleLight, fontSize: 24 },
  identityCopy: { marginLeft: 11 },
  dateText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  greeting: { color: COLORS.ink, fontSize: 17, fontWeight: '800', marginTop: 2 },
  levelRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 6 },
  levelBadge: {
    color: '#34275D',
    backgroundColor: '#D5CAFF',
    borderRadius: 9,
    paddingHorizontal: 7,
    paddingVertical: 2,
    fontSize: 9,
    fontWeight: '900',
    overflow: 'hidden',
  },
  rankBadge: {
    color: '#D1C9ED',
    backgroundColor: '#302B49',
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 9,
    overflow: 'hidden',
  },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerAction: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: '#211D36',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#302A49',
  },
  headerActionIcon: { color: '#F0EDFC', fontSize: 23 },
  shortcutRow: { gap: 8, paddingBottom: 12 },
  shortcutChip: {
    minHeight: 38,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#211D36',
    borderWidth: 1,
    borderColor: '#302A49',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutChipActive: { backgroundColor: '#302655', borderColor: '#51417F' },
  shortcutText: { color: '#C4BFD5', fontSize: 12, fontWeight: '600' },
  shortcutTextActive: { color: '#EEE9FF', fontWeight: '800' },
  moodBanner: {
    minHeight: 43,
    borderRadius: 17,
    backgroundColor: '#292440',
    borderWidth: 1,
    borderColor: '#38314F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  moodBannerIcon: { color: COLORS.yellow, fontSize: 13, marginRight: 8 },
  moodBannerText: { color: '#DBD5EB', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  moodBannerArrow: { color: COLORS.purpleLight, fontSize: 22, marginLeft: 8, marginTop: -2 },
  progressCard: {
    backgroundColor: '#382365',
    borderRadius: 22,
    padding: 18,
    overflow: 'hidden',
    marginBottom: 21,
    borderWidth: 1,
    borderColor: '#6953A4',
    shadowColor: '#8C55F6',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 5,
  },
  progressTextGroup: { zIndex: 1 },
  progressEyebrow: {
    color: '#D1BFFF',
    fontSize: 9,
    letterSpacing: 1.1,
    fontWeight: '800',
  },
  progressTitle: { color: '#FFFFFF', fontSize: 19, fontWeight: '800', marginTop: 8 },
  progressCaption: { color: '#D8CFEA', fontSize: 11, marginTop: 5 },
  progressTrack: {
    height: 7,
    borderRadius: 7,
    backgroundColor: '#604A8C',
    marginTop: 17,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 7, backgroundColor: COLORS.yellow },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    zIndex: 1,
  },
  progressPercent: { color: '#F3DA8B', fontSize: 11, fontWeight: '700' },
  progressLink: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  progressOrb: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#9751C5',
    opacity: 0.22,
    right: -24,
    top: -50,
  },
  progressOrbSmall: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F4C968',
    opacity: 0.12,
    right: 30,
    bottom: -42,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
    marginTop: 2,
  },
  sectionTitle: { color: COLORS.ink, fontSize: 18, fontWeight: '800' },
  sectionSubtitle: { color: COLORS.muted, fontSize: 10, marginTop: 4 },
  sectionMore: { color: '#C7B5FF', fontSize: 11, fontWeight: '600' },
  counterPill: {
    color: '#E7DBFF',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: '#383055',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  filterRow: { gap: 7, paddingBottom: 11 },
  filterChip: {
    borderRadius: 15,
    backgroundColor: '#211E32',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#343047',
  },
  filterChipActive: { backgroundColor: '#7560CD', borderColor: '#9B87FF' },
  filterText: { color: '#B8B3C9', fontSize: 10, fontWeight: '600' },
  filterTextActive: { color: '#FFFFFF', fontWeight: '800' },
  habitList: { gap: 8 },
  habitCard: {
    minHeight: 68,
    borderWidth: 1,
    borderColor: '#343047',
    backgroundColor: '#211E32',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  habitCardDone: { borderColor: '#514279', backgroundColor: '#29233E' },
  habitIcon: {
    width: 41,
    height: 41,
    borderRadius: 13,
    backgroundColor: '#302A43',
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitEmoji: { fontSize: 20 },
  habitCopy: { flex: 1, marginLeft: 11, marginRight: 8 },
  habitTitle: { color: '#F6F4FC', fontSize: 13, fontWeight: '700' },
  habitDetail: { color: '#AAA5B8', fontSize: 10, lineHeight: 15, marginTop: 3 },
  checkButton: {
    width: 29,
    height: 29,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#5D566E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonDone: { borderColor: COLORS.purple, backgroundColor: COLORS.purple },
  checkMark: { color: '#C3BED0', fontSize: 18, lineHeight: 20, fontWeight: '500' },
  checkMarkDone: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  communityStrip: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282440',
    borderRadius: 18,
    paddingHorizontal: 12,
    marginTop: 13,
    marginBottom: 19,
    borderWidth: 1,
    borderColor: '#38324F',
  },
  communityMark: {
    width: 37,
    height: 37,
    borderRadius: 13,
    backgroundColor: '#7560CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityMarkText: { color: '#FFFFFF', fontSize: 20 },
  communityCopy: { flex: 1, marginLeft: 10 },
  communityTitle: { color: '#F4F1FB', fontSize: 11, fontWeight: '800' },
  communityText: { color: '#B8B2C9', fontSize: 9, marginTop: 4 },
  communityArrow: { color: '#E9E3F6', fontSize: 25, marginHorizontal: 4 },
  featureRow: { flexDirection: 'row', gap: 10 },
  featureCardFocus: {
    flex: 1,
    minHeight: 132,
    borderRadius: 19,
    padding: 13,
    overflow: 'hidden',
    backgroundColor: '#7052C4',
    borderWidth: 1,
    borderColor: '#A185FF',
  },
  featureCardJournal: {
    flex: 1,
    minHeight: 132,
    borderRadius: 19,
    padding: 13,
    overflow: 'hidden',
    backgroundColor: '#168E9E',
    borderWidth: 1,
    borderColor: '#58D3D7',
  },
  featureIcon: { fontSize: 21, marginBottom: 8 },
  featureTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  featureCaption: { color: '#E5DEFA', fontSize: 10, marginTop: 3 },
  featureDotRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#59E19D', marginRight: 5 },
  featureLive: { color: '#F5F2FF', fontSize: 8, fontWeight: '700', flexShrink: 1 },
  journalTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2540',
    borderWidth: 1,
    borderColor: '#44385E',
    borderRadius: 17,
    padding: 12,
    marginTop: 17,
  },
  teaserIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: '#493E68',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teaserEmoji: { fontSize: 19 },
  teaserCopy: { flex: 1, marginLeft: 10, marginRight: 8 },
  teaserTitle: { color: '#F5F1FC', fontSize: 12, fontWeight: '800' },
  teaserText: { color: '#B8B1CA', fontSize: 10, lineHeight: 15, marginTop: 3 },
  teaserArrow: { color: '#C7B5FF', fontSize: 26, marginTop: -3 },
  encouragement: {
    color: '#9E98B1',
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 17,
  },
  bottomBar: {
    height: 68,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1C192B',
    borderColor: '#383149',
    borderWidth: 1,
    borderRadius: 25,
    marginHorizontal: 15,
    marginBottom: 7,
    paddingHorizontal: 7,
    shadowColor: '#000000',
    shadowOpacity: 0.34,
    shadowRadius: 15,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    gap: 6,
  },
  tabIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapSelected: {
    width: 52,
    height: 48,
    backgroundColor: COLORS.purple,
    shadowColor: COLORS.purple,
    shadowOpacity: 0.42,
    shadowRadius: 9,
    elevation: 5,
  },
  tabIcon: { color: '#AAA5B8', fontSize: 23, lineHeight: 27, fontWeight: '700' },
  tabLabel: { color: '#F7F5FF', fontSize: 10, fontWeight: '800', marginTop: 0 },
  tabSelected: { color: '#FFFFFF', fontWeight: '900' },
  pageHeading: { marginBottom: 22 },
  eyebrow: {
    color: '#B7A5FF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginBottom: 9,
  },
  pageTitle: { color: COLORS.ink, fontSize: 27, fontWeight: '800' },
  pageDescription: { color: COLORS.muted, fontSize: 13, lineHeight: 20, marginTop: 8 },
  promptCard: {
    backgroundColor: '#37265A',
    borderWidth: 1,
    borderColor: '#664D96',
    borderRadius: 20,
    padding: 19,
    marginBottom: 24,
  },
  promptIcon: { fontSize: 25, marginBottom: 10 },
  promptText: { color: '#F5F0FF', fontSize: 17, lineHeight: 24, fontWeight: '700' },
  inputLabel: { color: '#B8B1CA', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 9 },
  journalInput: {
    minHeight: 180,
    backgroundColor: '#201D30',
    borderColor: '#3B354E',
    borderWidth: 1,
    borderRadius: 18,
    color: '#F6F3FC',
    fontSize: 14,
    lineHeight: 22,
    padding: 16,
  },
  characterCount: { color: '#9690A6', textAlign: 'right', fontSize: 11, marginTop: 8 },
  primaryButton: {
    backgroundColor: COLORS.purple,
    borderRadius: 15,
    minHeight: 54,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  primaryButtonDisabled: { opacity: 0.48 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  primaryButtonArrow: { color: '#FFFFFF', fontSize: 20, fontWeight: '600' },
  successMessage: { backgroundColor: '#213E3C', borderRadius: 13, padding: 13, marginTop: 13 },
  successText: { color: '#8DE7BE', fontSize: 12, lineHeight: 18, fontWeight: '600' },
  tipCard: { borderTopColor: COLORS.line, borderTopWidth: 1, marginTop: 26, paddingTop: 20 },
  tipTitle: { color: '#F2EFFA', fontSize: 14, fontWeight: '800' },
  tipText: { color: COLORS.muted, fontSize: 12, lineHeight: 19, marginTop: 6 },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#211E34',
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: '#3B354F',
  },
  avatarLarge: {
    width: 78,
    height: 78,
    borderRadius: 27,
    backgroundColor: '#3A2D64',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLargeText: { fontSize: 37 },
  profileName: { color: COLORS.ink, fontSize: 18, fontWeight: '800', marginTop: 13 },
  profileCaption: { color: COLORS.muted, textAlign: 'center', fontSize: 12, marginTop: 5 },
  statsRow: { flexDirection: 'row', gap: 11, marginTop: 14 },
  statCard: {
    flex: 1,
    backgroundColor: '#2B2545',
    borderWidth: 1,
    borderColor: '#463A67',
    borderRadius: 17,
    paddingVertical: 17,
    alignItems: 'center',
  },
  statNumber: { color: '#C5B5FF', fontSize: 22, fontWeight: '800' },
  statLabel: { color: COLORS.muted, fontSize: 11, marginTop: 5 },
  aboutCard: {
    backgroundColor: '#211E32',
    borderWidth: 1,
    borderColor: '#39334B',
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
  },
  aboutTitle: { color: '#F4F0FB', fontSize: 15, fontWeight: '800' },
  aboutText: { color: COLORS.muted, fontSize: 12, lineHeight: 19, marginTop: 8 },
  divider: { height: 1, backgroundColor: COLORS.line, marginVertical: 14 },
  aboutFooter: { color: '#B9A8FF', fontSize: 11, fontWeight: '600' },
  secondaryButton: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#62518C',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  secondaryButtonText: { color: '#D0C2FF', fontSize: 13, fontWeight: '800' },
});
